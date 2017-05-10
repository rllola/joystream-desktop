import { observable, action, computed, runInAction } from 'mobx'
import {EventEmitter} from 'events'

const constants = require('../constants')

import WalletStore from './walletStore'
import SessionStore from './sessionStore'

class Application extends EventEmitter {
  @observable ready = false
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

    this.walletStore = null

    this.sessionStore = new SessionStore({
      session: this._session,
      savePath: this._savePath,
      db: this._db
    })

    this.stores = {
      applicationStore: this,
      sessionStore: this.sessionStore,
      walletStore: () => {
        return this.walletStore
      }
    }
  }

  async _initWallet () {
    // Try to open the wallet
    await this._spvnode.open()
    this._wallet = await this._spvnode.plugins.walletdb.get('primary')
  }

  async start () {

    // Try to initialize wallet and walletStore
    try {
      await this._initWallet()

      this.walletStore = new WalletStore(this._wallet)

      // Start spv sync
      this._syncWallet()

    } catch (e) {
      this.emit('error', e)
    }

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

  stop () {
    // We probably want to keep processing alerts until we exit the application so we shouldn't
    // clear the interval?
    // clearInterval(this._intervalTorrentUpdates)

    this._session.pause(() => {

    })

    this._spvnode.close()
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
}

export default Application
