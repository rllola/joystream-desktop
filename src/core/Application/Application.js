import path from 'path'
import os from 'os'
import mkdirp from 'mkdirp'
import { Session } from 'joystream-node'
import TorrentsStorage from '../../db'
import bcoin from 'bcoin'

import { observable, action } from 'mobx'

const constants = require('../../constants')

// Disable workers which are not available in electron
bcoin.set({ useWorkers: false })

import StateMachine from './ApplicationStateMachine'
import Client from './Client'

class Application {
  @observable torrents = []
  @observable downloadingNotificationCounter = 0
  @observable uploadingNotificationCounter = 0
  @observable completedNotificationCounter = 0

  _torrents = new Map()

  _machine = null
  _client = null

  _config = null

  _spvnode = null
  _wallet = null

  _session = null
  _torrentUpdateInterval = null

  _db = null

  constructor (machine) {
    this._machine = machine || StateMachine

    this._client = Client.create(this)

    // send inputs to the state machine with application bound as the client
    this._callMachine = function (...args) {
      this._machine.queuedHandle(this._client, ...args)
    }.bind(this)

    this.on = this._machine.on.bind(this._machine)
  }

  currentState () {
    return this._machine.compositeState(this._client)
  }

  start (config) {
    this._callMachine('start', config)
  }

  stop () {
    this._callMachine('stop')
  }

  _setConfig (config) {
    this._config = config || this._config
  }

  _getConfig () {
    return this._config
  }

  _initializeResources () {
    try {
      this._createDirectories(this._config)
      this._createSpvNode(this._config)
      this._createSession(this._config)
      this._callMachine('initialized_resources')
    } catch (err) {
      console.log(err)
      this._callMachine('failed', err)
    }
  }

  _reportError (err) {
    var error = {
      state: this._machine.compositeState(this._client),
      error: err
    }

    this.lastError = error
    console.log(err.message)
  }

  _clearResources () {
    this._spvnode = null

    if (this._session) {
      if (this._torrentUpdateInterval) {
        clearInterval(this._torrentUpdateInterval)
        this._torrentUpdateInterval = null
      }

      // TODO: update joystream-node session (to clearInterval)
      this._session.pauseLibtorrent((err) => {
        this.sesison = null
        this._callMachine('cleared')
      })
    } else {
      this.sesison = null
      this._callMachine('cleared')
    }
  }

  async _closeSpvNode () {
    await this._spvnode.close()
    this._spvnode = null
    this._callMachine('closed')
  }

  _closeWallet () {
    this._wallet = null
    this._callMachine('closed')
  }

  _closeDatabase () {
    if (this._db) {
      this._db.close((err) => {
        this._db = null
        this._callMachine('closed')
      })
    } else {
      this._db = null
      this._callMachine('closed')
    }
  }

  _createSession () {
    this._session = new Session({
      port: this._config.bitTorrentPort || process.env.LIBTORRENT_PORT
    })

    this._torrentUpdateInterval = setInterval(() => this._session.postTorrentUpdates(), constants.POST_TORRENT_UPDATES_INTERVAL)
  }

  _createSpvNode (config) {
    const options = {
      prefix: this._getWalletPath(config.appDirectory),
      db: config.spvNodeDb || 'leveldb',
      network: config.spvNodeNetwork || 'testnet',
      port: config.spvNodePort || process.env.WALLET_PORT
    }

    // Add a logger if log level is specified
    if (config.spvNodeLogLevel) {
      options.logger = new bcoin.logger({
        level: config.spvNodeLogLevel
      })
    }

    // Create bcoin SPV node
    this._spvnode = new bcoin.spvnode(options)

    // Attach the walletdb plugin
    this._spvnode.use(bcoin.walletplugin)
  }

  _getWalletPath (appDirectory) {
    return path.join(appDirectory, 'wallet')
  }

  _getDatabasePath (appDirectory) {
    return path.join(appDirectory, 'data')
  }

  _createDirectories ({appDirectory}) {
    mkdirp.sync(appDirectory)
    mkdirp.sync(this._getWalletPath(appDirectory))
    mkdirp.sync(this._getDatabasePath(appDirectory))
  }

  async _initializeDatabase () {
    const dbPath = this._getDatabasePath(this._config.appDirectory)

    try {
      this._db = await TorrentsStorage.open(dbPath, {
        // 'table' names to use
        'torrents': 'torrents',
        'resume_data': 'resume_data',
        'torrent_plugin_settings': 'torrent_plugin_settings'
      })

      this._callMachine('initialized_database')
    } catch (err) {
      this._callMachine('failed', err)
    }
  }

  async _initializeSpvNode (spvnode) {
    try {
      await this._spvnode.open()
      this._callMachine('initialized_spv_node')
    } catch (err) {
      this._callMachine('failed', err)
    }
  }

  async _initializeWallet () {
    try {
      this._wallet = await this._spvnode.plugins.walletdb.get('primary')
      if (this._wallet) {
        this._callMachine('initialized_wallet')
      } else {
        this._callMachine('failed', new Error('failed to open primary wallet'))
      }
    } catch (err) {
      this._callMachine('failed', err)
    }
  }

  async _connectToBitcoinNetwork () {
    try {
      await this._spvnode.connect()
      this._startWalletSync()
      this._callMachine('connected')
    } catch (err) {
      this._callMachine('failed', err)
    }
  }

  async _disconnectFromBitcoinNetwork () {
    await this._spvnode.disconnect()
    this._callMachine('disconnected')
  }

  _startWalletSync (spvnode) {
    this._spvnode.startSync()
  }

  async _loadTorrentsFromDatabase () {
    // Load persisted torrents from database into session store
    try {
      var infoHashes = await this._db.getInfoHashes()
    } catch (err) {
      return this._callMachine('failed', err)
    }

    // Setup loading counter
    this.numberOfTorrentsLoading = infoHashes.length

    if (infoHashes.length === 0) {
      this._callMachine('finished_loading')
    }

    try {
      var torrentParameters = await Promise.all(infoHashes.map((infoHash) => {
        return this._db.getTorrentAddParameters(infoHash)
      }))
    } catch (err) {
      return this._callMachine('failed', err)
    }

    // For reach set of parameters
    torrentParameters.forEach((p) => {
      this._session.addTorrent(p, (err, torrent) => {
        this.numberOfTorrentsLoading--

        if (!err) {
          // Create a Torrent mobx Store
          // Create a Torrent class (wraps a joystream-node/Torrent + Torrent State machine)
          // this class hooks up the torrent events to inputs on the statemachine etc.. (it also is the client)
          // for that machine. - we maintain our own map of _torrents
          // passing it mobx store to store state
          // Add mobx store to application store torrents array
          // this.torrents.push(...)
        }

        if (this.numberOfTorrentsLoading === 0) {
          this._callMachine('finished_loading')
        }
      })
    })
  }

  _terminateTorrents () {
    this._callMachine('terminated')
  }

  @action
  _uiShowDownloadingScene () {

  }

  @action
  _uiResetDownloadingNotificationCounter () {
    this.downloadingNotificationCounter = 0
  }

  @action
  _uiShowCompletedScene () {

  }

  @action
  _uiResetCompletedNotificationCounter () {
    this.completedNotificationCounter
  }

  @action
  _uiShowUploadingScene () {

  }

  @action
  _uiResetUploadingNotificationCounter () {
    this.uploadingNotificationCounter
  }
}

export default Application
