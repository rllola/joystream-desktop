var assert = require('chai').assert
var sinon = require('sinon')

var BaseMachine = require('../../../src/core/BaseMachine')

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

    var reentry = sinon.spy(function(client) {
      // as we are currently handling an input, the next call should get queued
      this.queuedHandle(client, 'spy', 'arg1', 'arg2')
      // if handler was successfully queued spy should not have been called yet
      assert(!spy.called)
    })

    machine.states['uninitialized'].reentry = reentry

    machine.queuedHandle(client, 'reentry')

    // make sure that the last handler was called
    assert(reentry.called)

    // ensure queued handler was dequed and called with correct arguments
    assert(spy.calledWith(client, 'arg1', 'arg2'))
  })
})
