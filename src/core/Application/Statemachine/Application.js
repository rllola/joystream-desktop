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
        client.config = config
        client.services = {}
        this.go(client, 'Starting/InitializingResources')
      }
    },

    Starting: {
      _child: Starting,
      //stop: allow user to cancel startup process / client.abortStarting = true
      //in each state of the starting machine before transitioning to next step it can
      //check this bool
    },

    Started: {
      _child: Started,
      stop: function (client) {
        this.go(client, 'Stopping/TerminatingTorrents')
      }
    },

    Stopping: {
      _child: Stopping
    }
  }
})

module.exports = ApplicationStateMachine
