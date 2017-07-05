import { observable, action, computed, runInAction } from 'mobx'
import {EventEmitter} from 'events'
import bcoin from 'bcoin'
import assert from 'assert'
import { SessionMode } from 'joystream-node'

import constants from '../constants'

import WalletStore from './walletStore'
import SessionStore from './sessionStore'

class Application extends EventEmitter {
  @observable syncingWallet = false
  @observable loadingTorrents = false

  constructor ({session, spvnode, db, config}) {
    super()

    this._session = session
    this._spvnode = spvnode
    this._wallet = null
    this._db = db
    this._config = config

    // Request regular torrent state updates
    this._intervalTorrentUpdates = setInterval(() => this._session.postTorrentUpdates(), constants.POST_TORRENT_UPDATES_INTERVAL)

    this.walletStore = new WalletStore()

    this.sessionStore = new SessionStore({
      session: this._session,
      savePath: this._savePath
    })

    this.stores = {
      applicationStore: this,
      sessionStore: this.sessionStore,
      walletStore: this.walletStore
    }

    this._session.on('torrent_added', this._onTorrentAdded.bind(this))

    this._session.on('torrent_removed', this._onTorrentRemoved.bind(this))
  }

  getDefaultTorrentFileSourceLocation () {
    return this._config.get('torrentFileSourceLocation', constants.DEFAULT_TORRENT_FILE_SOURCE_LOCATION)
  }

  setDefaultTorrentFileSourceLocation (newValue) {
    this._config.set('torrentFileSourceLocation', newValue)
  }

  getSavePath () {
    return process.env.SAVE_PATH ? process.env.SAVE_PATH : this._config.get('savePath', constants.DEFAULT_SAVE_PATH)
  }

  setSavePath (newValue) {
    this._config.set('savePath', newValue)
  }

  _torrentToBuyMode (infoHash, buyerTerms) {
    // check wallet

    assert(this._session.torrents.has(infoHash))

    const torrent = this._session.torrents.get(infoHash)

    torrent.toBuyMode(buyerTerms, (err) => {
      if (err) {
        console.log(err)
      } else {
        torrent.startPlugin()
      }
    })
  }

  _torrentToSellMode (infoHash, sellerTerms) {
    // check wallet

    assert(this._session.torrents.has(infoHash))

    const torrent = this._session.torrents.get(infoHash)

    torrent.toSellMode(sellerTerms, (err) => {
      if (err) {
        console.log(err)
      } else {
        torrent.startPlugin()
      }
    })
  }

  _torrentToObserveMode (infoHash) {
    assert(this._session.torrents.has(infoHash))
    const torrent = this._session.torrents.get(infoHash)
    torrent.toObserveMode((err) => {
      if (err) {
        console.log(err)
      } else {
        torrent.startPlugin()
      }
    })
  }

  async _initWallet () {
    // Try to initialize spvnode
    try {
      await this._spvnode.open()
    } catch (e) {
      this.emit('error', e)
      return
    }

    // Try to open the wallet
    try {
      this._wallet = await this._spvnode.plugins.walletdb.get('primary')
    } catch (e) {
      this.emit('error', e)
      return
    }

    // If wallet was successfully initialized update the walletStore
    // and start syncing
    this.walletStore.setWallet(this._wallet)

    // Start synching
    this._syncWallet()
  }

  async start () {
    this._initWallet()

    this.loadingTorrents = true

    try {
      await this._loadTorrentsFromDb()
    } catch (e) {
      this.emit('error', e)
    }

    this.loadingTorrents = false
  }

  async _syncWallet () {
    await this._spvnode.connect()

    this._spvnode.startSync()

    this.syncingWallet = true
  }

  // This should be the action to take when the application needs to be shutdown gracefully
  @action
  stop () {
    // We probably want to keep processing alerts until we exit the application so we shouldn't
    // clear the interval?
    // clearInterval(this._intervalTorrentUpdates)

    this._session.pauseLibtorrent(() => {

    })

    // Wait for torrents to complete generating resume data

    // Close all open payment channels (broadcast settlement contracts)

    // Make sure db is flushed to disk

    // Minimizing tasks at shutdown is preferred

    this._spvnode.close()

    // emit event to indicate that we are done.. maybe some cleanup routine
    // is needed in index.js and call process.exit ?
  }

  _onTorrentAdded (torrent) {
    this._monitorTorrent(torrent)

    if (this.loadingTorrents) {
      this._applyTorrentSettingsFromDb(torrent.infoHash)
    } else {
      this._db.saveTorrent(torrent)
    }
  }

  _onTorrentRemoved (infoHash) {
    this._db.removeTorrent(infoHash)
  }

  async _loadTorrentsFromDb () {
    // Load persisted torrents from database into session store
    let infoHashes = await this._db.getInfoHashes()

    let parameters = await Promise.all(infoHashes.map((infoHash) => {
      return this._db.getTorrentAddParameters(infoHash)
    }))

    let torrents = await Promise.all(parameters.map((params) => {
      if (params == null) return null
      return this.sessionStore.loadTorrent(params)
    }))

    torrents = torrents.filter((torrent) => torrent !== null)

    console.log('Loaded ', torrents.length, ' torrents from db')
  }

  async _applyTorrentSettingsFromDb (infoHash) {
    var settings = await this._db.getTorrentSettings(infoHash)

    // If a torrent never was set to a specific mode it will not have a record in the database
    if (settings === null) return

    switch (settings.mode) {
      case SessionMode.buying:
        this._torrentToBuyMode(infoHash, settings.buyerTerms)
        break
      case SessionMode.selling:
        this._torrentToSellMode(infoHash, settings.sellerTerms)
        break
      case SessionMode.observing:
        this._torrentToObserveMode(infoHash)
        break
      default:
        // We do not save torrent settings "payment terms" if the mode is not set
        assert(false)
    }
  }

  // Monitor a torrent over its lifetime and take necessary actions
  // such as saving to database
  _monitorTorrent (torrent) {
    const infoHash = torrent.handle.infoHash()

    torrent.on('metadata', (torrentInfo) => {
      this._db.saveTorrent(torrent)
    })

    torrent.on('resumedata', (buff) => {
      this._db.saveTorrentResumeData(infoHash, buff)
    })

    // Save resume data when paused or finished
    torrent.on('paused', () => {
      torrent.handle.saveResume_data()
    })

    torrent.on('finished', () => {
      torrent.handle.saveResume_data()
    })

    torrent.on('sessionToSellMode', (alert) => {
      if (this.loadingTorrents) return

      this._db.saveTorrentSettings(infoHash, {
        mode: SessionMode.selling,
        sellerTerms: alert.terms
        //state: observableTorrent.state
      })
    })

    torrent.on('sessionToBuyMode', (alert) => {
      if (this.loadingTorrents) return

      this._db.saveTorrentSettings(infoHash, {
        mode: SessionMode.buying,
        buyerTerms: alert.terms
        //state: observableTorrent.state
      })
    })

    torrent.on('sessionToObserveMode', (alert) => {
      if (this.loadingTorrents) return

      this._db.saveTorrentSettings(infoHash, {
        mode: SessionMode.observing
        //state: observableTorrent.state
      })
    })
  }
}

export default Application
