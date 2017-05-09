import { observable, action, computed, runInAction } from 'mobx'
import {EventEmitter} from 'events'

const constants = require('../constants')

import WalletStore from './walletStore'
import SessionStore from './sessionStore'

class Application extends EventEmitter {
  @observable ready = false
  @observable syncingWallet = false

  constructor ({session, savePath, spvnode, db}) {
    super()

    this._session = session
    this._savePath = savePath
    this._spvnode = spvnode
    this._wallet = null
    this._db = db

    this.sessionStore = null
    this.walletStore = null

    this._init()
  }

  async _initWallet () {
    if (this._wallet) return

    // Try to open the wallet
    try {
      await this._spvnode.open()
      try {
        this._wallet = await this._spvnode.plugins.walletdb.get('primary')
      } catch (e) {
        console.log('Failed to get SPV Wallet')
      }
    } catch (e) {
      console.error('Failed to open SPV Node')
    }
  }

  async _init () {
    await this._initWallet()

    if (this._wallet) this.walletStore = new WalletStore(this._wallet)

    // TODO: Instead of passing db directly, pass in an object with @actions -> proxy db calls
    this.sessionStore = new SessionStore({
      session: this._session,
      savePath: this._savePath,
      db: this._db
    })

    // Request regular torrent state updates
    this._intervalTorrentUpdates = setInterval(() => this._session.postTorrentUpdates(), constants.POST_TORRENT_UPDATES_INTERVAL)

    this.emit('ready', this.stores())

    this.ready = true

    this._loadTorrentsFromDb()

    await this._spvnode.connect()

    this._spvnode.startSync()

    this.syncingWallet = true
  }

  stop () {
    clearInterval(this._intervalTorrentUpdates)
  }

  stores () {
    return {
      sessionStore: this.sessionStore,
      walletStore: this.walletStore
    }
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
