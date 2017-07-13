import { assert } from 'chai'
import sinon from 'sinon'
import os from 'os'
import path from 'path'

// babel-polyfill for generator (async/await)
import 'babel-polyfill'

import ASM from '../../../src/core/Application/ApplicationStateMachine'
import Client from '../../../src/core/Application/Client'

describe('application statemachine', function () {
  let client = MockedClient()

  function handle (...args) {
    ASM.handle(client, ...args)
  }

  function machineState () {
    return ASM.compositeState(client)
  }

  function assertState (s) {
    assert.equal(machineState(), s)
  }

  before(function () {

  })

  after(function () {

  })

  it('starting', function () {
    assertState('NotStarted')

    const config = {'port': 123}

    handle('start', config)

    assert(client.setConfig.calledWith(config))

    assertState('Starting.initializing_resources')

    handle('initialized_resources')
    handle('initialized_database')
    handle('initialized_spv_node')
    handle('initialized_wallet')
    handle('connected')
    handle('finished_loading')

    assertState('Started.OnDownloadingScene.uninitialized')

    assert(client.setActiveScene.calledWith('Downloading'))

    handle('showing_scene')

    assertState('Started.OnDownloadingScene.idle')
  })
})

function MockedClient () {
  let client = {}
  let _config

  Client.API.forEach(function (funcName) {
    client[funcName] = sinon.spy()
  })

  // hmm perhaps the config should be stored in the state machine's internal state
  // instead of by the core application which implements the client
  client.setConfig = sinon.spy(function (config) {
    _config = config
  })

  client.getConfig = sinon.spy(function () {
    return _config
  })

  return client
}
