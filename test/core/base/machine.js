import base from '../../../src/core/BaseMachine'

let substate = base.extend({
  initialState: 'waiting_for_payment',
  initialize: function (options) {

  },
  states: {
    waiting_for_payment: {
      _onEnter: function (client) {
        client.deposited = 0
      },
      deposit: function (client, amount) {
        if (amount === -1) {
          this.go(client, ['..', 'error'])
        } else {
          client.deposited = amount
          this.transition(client, 'waiting_for_selection')
        }
      },
      _reset: function (client) {
        // will be called when parent machine transitions
      }
    },
    waiting_for_selection: {
      _onEnter: function (client) {

      },
      selectItem: function (client, code) {
        client.selectedItem = code
        this.transition(client, 'dispensing')
      }
    },

    dispensing: {
      _onEnter: function (client) {
        this.emit('dispensed', client.selectedItem)
        this.transition(client, 'waiting_for_payment')
      }
    }
  }
})

let fsm = base.extend({
  initialState: 'off',
  namespace: 'vendingMachine',
  initialize: function (options) {
    this.createSubMachine(options.states.on, substate)
  },

  states: {
    'off': {
      _onEnter: function (client) {

      },
      power_on: 'on'
    },

    'on' : {
      _onEnter: function (client) {
        this.emit('started', client)
      },
      power_off: 'off',
      _onExit: function (client) {
        this.emit('stopped', client)
      }
    },

    'error': {
      _onEnter: function (client) {
      },
      repair: 'on'
    }
  },

  // Turn the machine on
  power_on: function (client) {
    this.handle(client, 'power_on')
  },

  // Turn off the machine
  power_off: function (client) {
    this.handle(client, 'power_off')
  },

  deposit: function (client, amount) {
    this.handle(client, 'deposit', amount)
  },

  selectItem: function (client, item) {
    this.handle(client, 'selectItem', item)
  },

  repair: function (client) {
    this.handle(client, 'repair')
  }
})

export default fsm
