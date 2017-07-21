// Use of pure js bcoin library because electron doesn't compile with openssl
// which is needed.
process.env.BCOIN_NO_NATIVE = '1'

import { assert } from 'chai'
import sinon from 'sinon'

// babel-polyfill for generator (async/await)
import 'babel-polyfill'

import ASM from '../../../src/core/Application/Statemachine'

describe('Application Statemachine', function () {
  let client = NewMockedClient()

  function handle (...args) {
    ASM.queuedHandle(client, ...args)
  }

  function machineState () {
    return ASM.compositeState(client)
  }

  function assertState (s) {
    assert.equal(machineState(), s)
  }

  it('starting', function (done) {

    function completed (startedSuccessfully) {
      transitionHandler.off()
      invalidstateHandler.off()

      assert(startedSuccessfully)

      done()
    }

    var transitionHandler = ASM.on('transition', function (data) {
      //console.log('transition from:', transition.fromState, 'to:', transition.toState)
      console.log('state:', machineState())
      if (data.toState === 'Started' && data.fromState === 'Starting') {
        completed(true)
      }
    })

    // This is not necessarily an error
    // ASM.on('nohandler', function (data) {
    //   if (data.client !== client) return
    //   console.log('no handler event:', data.inputType)
    //   completed()
    // })

    var invalidstateHandler = ASM.on('invalidstate', function (data) {
      console.log('invalid state:', data.state)
      completed()
    })

    assertState('NotStarted')

    // skipping resource initialization
    ASM.go(client, 'Starting/initializingApplicationDatabase')
  })

  it ('changing scenes', function () {
    assertState('Started.OnDownloadingScene.idle')

    handle('completed_scene_selected')
    assertState('Started.OnCompletedScene.idle')

    handle('uploading_scene_selected')
    assertState('Started.OnUploadingScene.idle')

    handle('downloading_scene_selected')
    assertState('Started.OnDownloadingScene.idle')
  })

  it('stopping', function (done) {
    function completed (stoppedSuccefully) {
      transitionHandler.off()
      invalidstateHandler.off()

      assert(stoppedSuccefully)

      done()
    }

    assertState('Started.OnDownloadingScene.idle')

    var transitionHandler = ASM.on('transition', function (data) {
      //console.log('transition from:', transition.fromState, 'to:', transition.toState)
      console.log('state:', machineState())
      if (data.toState === 'NotStarted' && data.fromState === 'Stopping') {
        completed(true)
      }
    })

    var invalidstateHandler = ASM.on('invalidstate', function (data) {
      console.log('invalid state:', data.state)
      completed()
    })

    handle('stop')
  })
})

function NewMockedClient () {
  let client = {}

  client.factories = null

  client.config = {
    appDirectory: 'temp',
    logLevel: 'error',
    network: 'testnet'
  }

  var services = client.services = {}

  var db = {
    getInfoHashes: sinon.spy(function () {
      return ['infohash-0']
    }),

    getTorrentAddParameters: sinon.spy(function (infoHash) {
      return { infoHash }
    }),

    close: sinon.spy(function (callback) {
      callback()
    })
  }

  services.openDatabase = sinon.spy(function () {
    return db
  })

  var session = services.session = {}

  session.addTorrent = sinon.spy(function (addParams, callback) {
    callback(null, {
      infoHash: addParams.infoHash
    })
  })

  session.pauseLibtorrent = sinon.spy(function (callback) {
    callback(null)
  })
  var spvnode = services.spvnode = {}

  spvnode.open = sinon.spy(function (callback) {
    callback()
  })

  spvnode.close = sinon.spy(function () {

  })

  spvnode.connect = sinon.spy(function () {

  })

  spvnode.disconnect = sinon.spy(function () {

  })

  spvnode.getWallet = sinon.spy(function () {
    return {}
  })

  client.reportError = function (err) {
    console.log(err.message)
  }

  var store = client.store = {}

  store.setTorrentsToLoad = function (num) {

  }

  store.setTorrentLoadingProgress = function (progress) {

  }

  return client
}
