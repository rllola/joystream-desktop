const assert = require('assert')
const path = require('path')
const os = require('os')
const mkdirp = require('mkdirp')
const Session = require('joystream-node').Session
const TorrentsStorage = require('../../db').default
const bcoin = require('bcoin')

const observable = require('mobx').observable
const action = require('mobx').action
const runInAction = require('mobx').runInAction

const constants = require('../../constants')

const Scene = require('./Scene')

// Disable workers which are not available in electron
bcoin.set({ useWorkers: false })

const StateMachine = require('./ApplicationStateMachine')
const Client = require('./Client')

class Application {
  @observable torrents = []
  @observable downloadingNotificationCounter = 0
  @observable uploadingNotificationCounter = 0
  @observable completedNotificationCounter = 0
  @observable numberOfTorrentsLoading = 0
  @observable activeScene = null
  @observable state = null

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
    this.off = this._machine.off.bind(this._machine)

    this.updateState()

    this.on('transition', this.updateState)
  }

  @action.bound
  updateState () {
    this.state = this._machine.compositeState(this._client)
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
    try {
      if (this._spvnode) await this._spvnode.close()
    } catch (e) {
      console.log(e)
    }
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
      requestMempool: true
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
    /* code marked "temp" is workaround until http listen fix is merged into bcoin release */
    // temp
    const error = (err) => {
      if (err.code !== 'EADDRINUSE') return
      if (error.handled) return
      error.handled = true
      this._spvnode = null // to skip call to spvnode.close() in closeSpvNode() - because asyncobject might still be locked
      this._callMachine('failed', err)
    }

    // temp
    this._spvnode.on('error', error)

    try {
      await this._spvnode.open()
    } catch (err) {
      if (error.handled) return // temp
      return this._callMachine('failed', err)
    }

    // before the fix .. if there is an error listening on the port code will never even reach here

    assert(!error.handled) // temp - but should always hold

    this._callMachine('initialized_spv_node')
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
      this._spvnode.startSync()
      this._callMachine('connected')
    } catch (err) {
      this._callMachine('failed', err)
    }
  }

  async _disconnectFromBitcoinNetwork () {
    this._spvnode.stopSync()
    await this._spvnode.disconnect()
    this._callMachine('disconnected')
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

  selectingScene (s) {
    const event = (() => {
      switch (s) {
        case Scene.Downloading: return 'downloading_scene_selected'
        case Scene.Uploading: return 'uploading_scene_selected'
        case Scene.Completed: return 'completed_scene_selected'
      }
    })()

    this._callMachine(event)
  }

  @action
  _setActiveScene (scene) {
    this.activeScene = scene
  }

  @action
  _resetDownloadingNotificationCounter () {
    this.downloadingNotificationCounter = 0
  }

  @action
  _resetCompletedNotificationCounter () {
    this.completedNotificationCounter = 0
  }

  @action
  _resetUploadingNotificationCounter () {
    this.uploadingNotificationCounter = 0
  }
}

export default Application
