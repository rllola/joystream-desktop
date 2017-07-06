/**
 * Created by bedeho on 11/06/17.
 */
import BaseMachine from '../BaseMachine'

import Starting from './Starting/Starting'
//import Started from './Started/Started'
import Stopping from './Stopping/Stopping'

var ApplicationStateMachine = new BaseMachine({
  namespace: 'Application',
  initialState: 'NotStarted',
  initializeMachine: function (options) {

  },

  states: {
    NotStarted: {
      start: function (client, config) {
        // client._state = {}
        // client.setConfig(config)
        this.deferUntilTransition(client)
        this.transition(client, 'Starting')
        //this.handle - defer until transition - start
      }
    },

    Starting: {
      _child: Starting
    },

    Started: {
      //_child: Started
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
