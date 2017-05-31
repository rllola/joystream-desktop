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

  constructor ({session, savePath, spvnode, db}) {
    super()

    this._session = session
    this._savePath = savePath
    this._spvnode = spvnode
    this._wallet = null
    this._db = db

    // Request regular torrent state updates
    this._intervalTorrentUpdates = setInterval(() => this._session.postTorrentUpdates(), constants.POST_TORRENT_UPDATES_INTERVAL)

    this.walletStore = new WalletStore()

    this.sessionStore = new SessionStore({
      session: this._session,
      savePath: this._savePath,
      db: this._db
    })

    this.stores = {
      applicationStore: this,
      sessionStore: this.sessionStore,
      walletStore: this.walletStore
    }
  }

  buyingTorrent (infoHash, buyerTerms) {
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

  sellingTorrent (infoHash, sellerTerms) {
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

    this._session.on('torrent_added', function (torrent) {
      this._db.saveTorrent(torrent)
    })

    this._session.on('torrent_removed', function (infoHash) {
      this._db.removeTorrent(infoHash)
    })
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

    torrents.forEach(async (t) => {
      this._monitorTorrent(t.torrent)

      // Load torrent settings, set terms and target mode on torrent
      // or goto mode immediately (buy mode and sell mode need torrent to be in downloading
      // and seeding state respectively or will fail)
      let settings = await this._db.getTorrentSettings(t.infoHash)

      if(settings) {
        if(settings.mode === SessionMode.buying) {
          this.buyingTorrent(t.infoHash, settings.buyerTerms)
        } else if (settings.mode === SessionMode.selling) {
          this.sellingTorrent(t.infoHash, settings.sellerTerms)
        } else if (settings.mode === SessionMode.observing) {
          // ...
        }
      }
    })
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
      this._db.saveTorrentSettings(infoHash, {
        mode: SessionMode.selling,
        sellerTerms: alert.terms,
        //state: observableTorrent.state
      })
    })

    torrent.on('sessionToBuyMode', (alert) => {
      this._db.saveTorrentSettings(infoHash, {
        mode: SessionMode.buying,
        buyerTerms: alert.terms,
        //state: observableTorrent.state
      })
    })

    torrent.on('sessionToObserveMode', (alert) => {
      this._db.saveTorrentSettings(infoHash, {
        mode: SessionMode.observing,
        //state: observableTorrent.state
      })
    })
  }
}

export default Application
