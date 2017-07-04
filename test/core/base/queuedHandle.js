import { assert, expect } from 'chai'
import sinon from 'sinon'

import BaseMachine from '../../../src/core/BaseMachine'

var machine = new BaseMachine({
  states: {
    uninitialized: {
    }
  }
})

describe('Queued Handle Method', function(){

  it('immediately calls handle if no other handler executing', function(){
    var client = {}
    var spy = sinon.spy()
    machine.states['uninitialized'].spy = spy
    machine.queuedHandle(client, 'spy', 'arg1', 'arg2')

    assert(Array.isArray(machine._handleQueue))
    assert(spy.called)
    assert(spy.calledWith(client, 'arg1', 'arg2'))
  })

  it('queues handlers', function(){
    var client = {}

    var spy = sinon.spy()

    machine.states['uninitialized'].spy = spy

    var reentry = sinon.spy( function(client) {
      this.queuedHandle(client, 'spy', 'arg1', 'arg2')
      assert(!spy.called)
    })

    machine.states['uninitialized'].reentry = reentry

    machine.queuedHandle(client, 'reentry')
    assert(reentry.called)
    assert(spy.calledWith(client, 'arg1', 'arg2'))
  })
})
