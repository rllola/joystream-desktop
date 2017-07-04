import { assert, expect } from 'chai'
import sinon from 'sinon'
import _ from 'lodash'

import machine from './machine'

describe('Base State Machine', function () {

  it('has a go method', function () {
    expect(machine.go).to.be.a('function')
  })

  it('has a linkChildren method', function () {
    expect(machine.linkChildren).to.be.a('function')
  })

  it('has a queuedHandle method', function () {
    expect(machine.queuedHandle).to.be.a('function')
  })

  it('implements states', function () {
    const states = [
      'off',
      'on',
      'error'
    ]

    _.forEach(states, function (state) {
      assert(_.has(machine.states, state))
    })
  })

  it('initial state is off', function () {
    assert.equal(machine.initialState, 'off')

    // initialise a state object
    let client = {}
    let state = machine.compositeState(client)

    assert.equal(state, 'off')
    assert.equal(client.__machina__.vendingMachine.state, 'off')
  })

  it('can be turned on', function () {
    const machine_id = 'coke'

    let cokeMachine = {'id': machine_id}

    machine.power_on(cokeMachine)

    let state = machine.compositeState(cokeMachine)
    assert.equal(state, 'on.waiting_for_payment')
  })

  it('can accept deposit and dispense', function () {
    const machine_id = 'coke'

    let cokeMachine = {'id': machine_id}

    machine.power_on(cokeMachine)

    let state = machine.compositeState(cokeMachine)

    assert.equal(state, 'on.waiting_for_payment')

    machine.deposit(cokeMachine, 10)

    assert.equal(cokeMachine.deposited, 10)

    state = machine.compositeState(cokeMachine)

    assert.equal(state, 'on.waiting_for_selection')

    let spy = sinon.spy()
    machine.on('dispensed', spy)
    machine.selectItem(cokeMachine, 100)

    assert.equal(cokeMachine.selectedItem, 100)

    assert(spy.called)
    state = machine.compositeState(cokeMachine)
    assert.equal(state, 'on.waiting_for_payment')
  })

  it('can break and be repaired', function () {
    const machine_id = 'coke'

    let cokeMachine = {'id': machine_id}

    machine.power_on(cokeMachine)

    machine.deposit(cokeMachine, -1)

    let state = machine.compositeState(cokeMachine)

    assert.equal(state, 'error')

    machine.repair(cokeMachine)

    state = machine.compositeState(cokeMachine)

    assert.equal(state, 'on.waiting_for_payment')
  })
})
