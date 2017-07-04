import { assert, expect } from 'chai'

import Machine from './complex_machine'

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
    let machine = new Machine()
    let client = {}

    const assertState = assertCompositeState.bind(null, machine, client)

    const transition = deepTransition.bind(null, machine, client)

    assertState('X.a.A')

    transition(['..', 'b'])

    assertState('X.b.A') // * see note below

    transition(['..', '..', 'Y'])

    assertState('Y.a.A')

    transition(['..', '..'])

    // *transitions do not transition child state machines to their initial states
    // the last known state is preserved
    assertState('X.b.A')

    transition(['..', '..', 'X', 'a', 'A'])

    assertState('X.a.A')

    transition('../b/B')

    assertState('X.b.B')
  })
})
