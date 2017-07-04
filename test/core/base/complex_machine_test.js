var assert = require('chai').assert
var expect = require('chai').expect
var sinon = require('sinon')

var machine = require('./complex_machine')

function assertCompositeState (machine, client, state) {
  assert.equal(machine.compositeState(client), state)
}

// Get instance of state machine for active substate.
// compositeState separates states with a period (.)
// so this function will break if states have a period in their names
function getActiveStateMachine (machine, client) {
  let compositeState = machine.compositeState(client).split('.')

  compositeState.forEach(function (state) {
    machine = machine.states[state]._child || machine
    machine = machine.instance || machine
  })

  return machine
}

function deepTransition (machine, client, path) {
  getActiveStateMachine(machine, client).go(client, path)
}

describe('Deep state tree transitions', function () {
  it('state transitions', function () {
    let client = {}

    const assertState = assertCompositeState.bind(null, machine, client)

    const transition = deepTransition.bind(null, machine, client)

    assertState('X.a.A')

    transition(['..', 'b'])

    assertState('X.b')

    transition(['..', 'Y'])

    assertState('Y')

    transition(['X', 'a', 'A'])

    assertState('X.a.A')

    transition('../b')

    assertState('X.b')
  })
})
