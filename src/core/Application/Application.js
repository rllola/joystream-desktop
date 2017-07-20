// Application core
const assert = require('assert')
const path = require('path')
const os = require('os')
const mkdirp = require('mkdirp')
const Session = require('joystream-node').Session
const TorrentsStorage = require('../../db').default
const bcoin = require('bcoin')



const Scene = require('./Scene')

// Disable workers which are not available in electron
bcoin.set({ useWorkers: false })

const EventEmitter = require('events').EventEmitter
const Statemachine = require('./Statemachine')
const ApplicationStore = require('./ApplicationStore')

class Application extends EventEmitter {

  constructor () {
    super()

    this.store = new ApplicationStore({
      // handlers
      addTorrent: this.addTorrent.bind(this),
      moveToScene: this.moveToScene.bind(this)
    })

    var client = new ApplicationStatemachineClient(this.store)

    Statemachine.on('transition', (data) => {
      if(data.client !== this._client)
        return

      this.store.setState(Statemachine.compositeState(client))
    })

    // trigger initial state of machine
    Statemachine.compositeState(this._client)

    this._process = function (...args) {
      Satemachine.queuedHandle(client, ...args)
    }
  }

  addTorrent (info) {
    this._process('addTorrent', info)
  }

  moveToScene (s) {
    const event = (() => {
      switch (s) {
        case Scene.Downloading: return 'downloading_scene_selected'
        case Scene.Uploading: return 'uploading_scene_selected'
        case Scene.Completed: return 'completed_scene_selected'
      }
    })()

    if (event) {
      this._process(event)
    }
  }

  start (config) {
    this._process('start', config)
  }

  stop () {
    this._process('stop')
  }
}

class ApplicationStatemachineClient {

  constructor (applicationStore) {
    this.store = applicationStore
  }


  reportError (err) {
    var error = {
      state: this._machine.compositeState(this._client),
      error: err
    }

    this.lastError = error
    console.log(err.message)
  }

  // methods defined here should really only try to modify the sotre (avoid using state information
  // stored on the client - statemachine should pass them in as args instead)

}

export default Application
