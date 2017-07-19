/**
 * Created by bedeho on 11/06/17.
 */
const BaseMachine = require('../../BaseMachine')

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
        client._state = {}
        client.setConfig(config)
        this.go(client, 'Starting/initializing_resources')
      }
    },

    Starting: {
      _child: Starting
    },

    Started: {
      _child: Started,
      stop: function (client) {
        this.go(client, 'Stopping/terminating_torrents')
      }
    },

    Stopping: {
      _child: Stopping
    }
  }
})

module.exports = ApplicationStateMachine
