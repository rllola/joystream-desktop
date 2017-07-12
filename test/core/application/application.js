// Use of pure js bcoin library because electron doesn't compile with openssl
// which is needed.
process.env.BCOIN_NO_NATIVE = '1'

import { assert } from 'chai'
import os from 'os'
import path from 'path'
import rimraf from 'rimraf'
import mkdirp from 'mkdirp'

// babel-polyfill for generator (async/await)
import 'babel-polyfill'

import Application from '../../../src/core/Application'

describe('application', function () {
  // skip this test in Travis/CI ?
  //if (process.env.CI || process.env.TRAVIS) return

  const TEMP_WORKING_DIR = path.join(os.tmpdir(), 'joystream_unit_tests')

  // remove default timeout
  this.timeout(0)

  before(function (done) {
    mkdirp(TEMP_WORKING_DIR, done)
  })

  after(function (done) {
    rimraf(TEMP_WORKING_DIR, done)
  })

  it('starting/stopping', function (done) {
    let app = new Application()

    app.on('transition', function (transition) {
      console.log('transition from:', transition.fromState, 'to:', transition.toState)
      //console.log('state:', app.currentState())
      if (transition.toState === 'Started' && transition.fromState === 'Starting') {
        app.stop()
      }

      if (transition.toState === 'NotStarted' && transition.fromState === 'Stopping') {
        done()
      }
    })

    app.on('nohandler', function (e) {
      console.log('no handler event:', e.inputType)
      assert(false)
    })

    app.on('invalidstate', function (e) {
      console.log('invalid state:', e.state)
      assert(false)
    })

    app.start({
      appDirectory: TEMP_WORKING_DIR,
      spvNodeLogLevel: 'error',
      spvNodeNetwork: 'testnet'
    })
  })
})
