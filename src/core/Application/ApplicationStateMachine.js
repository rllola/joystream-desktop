/**
 * Created by bedeho on 11/06/17.
 */
const BaseMachine = require('../BaseMachine')

const Starting = require('./Starting/Starting')
const Started = require('./Started/Started')
const Stopping = require('./Stopping/Stopping')

var ApplicationStateMachine = new BaseMachine({
  namespace: 'Application',
  initialState: 'NotStarted',
  initializeMachine: function (options) {

  },

  states: {
    NotStarted: {
      start: function (client, config) {
        this.deferUntilTransition(client)
        this.transition(client, 'Starting')
      }
    },

    Starting: {
      _child: Starting
    },

    Started: {
      _child: Started,
      stop: function (client) {
        this.deferUntilTransition(client)
        this.transition(client, 'Stopping')
      }
    },

    Stopping: {
      _child: Stopping
    }
  }
})

module.exports = ApplicationStateMachine
