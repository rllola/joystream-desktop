/**
 * Created by bedeho on 11/06/17.
 */
import BaseMachine from '../BaseMachine'

import Starting from './Starting/Starting'
import Started from './Started/Started'
import Stopping from './Stopping/Stopping'

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

export default ApplicationStateMachine
