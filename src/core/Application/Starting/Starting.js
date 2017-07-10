/**
 * Created by bedeho on 12/06/17.
 */

const BaseMachine = require('../../BaseMachine')

var Starting = new BaseMachine({
  namespace: 'Starting',
  initialState: 'uninitialized',
  initializeMachine : function (options) {

  },
  states: {
    uninitialized: {
      start: function (client, config) {
        client._state = {}
        client.setConfig(config)
        this.transition(client, 'initializing_resources')
      }
    },
    initializing_resources: {
      _onEnter: function (client) {
        client.initializeResources()
      },
      initialized_resources: function (client) {
        this.transition(client, 'initializing_application_database')
      },
      failed: function (client, err) {
        client.lastError = {
          state: this.compositeState(client),
          error: err
        }
        this.go(client, '../Stopping/clearing_resources')
      },
      _reset: 'uninitialized'
    },

    initializing_application_database: {
      _onEnter: function (client) {
        client.initializeDatabase()
      },
      initialized_database: function (client) {
        this.transition(client, 'initializing_spv_node')
      },
      failed: function (client, err) {
        client.lastError = {
          state: this.compositeState(client),
          error: err
        }
        this.go(client, '../Stopping/closing_application_database')
      },
      _reset: 'uninitialized'
    },

    initializing_spv_node: {
      _onEnter: function (client) {
        client.initializeSpvNode()
      },
      initialized_spv_node: function (client) {
        this.transition(client, 'opening_wallet')
      },
      failed: function (client, err) {
        client.lastError = {
          state: this.compositeState(client),
          error: err
        }
        this.go(client, '../Stopping/stopping_spv_node')
      },
      _reset: 'uninitialized'
    },

    opening_wallet: {
      _onEnter: function (client) {
        client.initializeWallet()
      },
      initialized_wallet: function (client) {
        this.transition(client, 'connecting_to_bitcoin_p2p_network')
      },
      failed: function (client, err) {
        client.lastError = {
          state: this.compositeState(client),
          error: err
        }
        this.go(client, '../Stopping/closing_wallet')
      },
      _reset: 'uninitialized'
    },

    connecting_to_bitcoin_p2p_network: {
      _onEnter: function (client) {
        client.getConfig().connectToBitcoinNetworkRetryLimit = client.getConfig().connectToBitcoinNetworkRetryLimit || 3
        client._state.abortConnectToBitcoinNetwork = false
        client._state.connectToBitcoinNetworkAttempts = 1

        // if options allows to start offline, don't connect

        client.connectToBitcoinNetwork()
      },
      connected: function (client) {
        // if we cancelled during connection attempt do not try to reconnect
        if (client._state.abortConnectToBitcoinNetwork) {
          this.go(client, '../Stopping/disconnecting_from_bitcoin_p2p_network')
        } else {
          this.transition(client, 'loading_torrents')
        }
      },
      cancel: function (client) {
        client._state.abortConnectToBitcoinNetwork = true
      },
      // We need to ensure we successfully connect at least once (bcoin will not attempt to reconnect by itself)
      // but what if user wants to start offline, perhaps a statemachine to mange connectivity and let application
      // continue to start?
      failed: function (client, err) {
        client.lastError = {
          state: this.compositeState(client),
          error: err
        }

        // if we cancelled during connection attempt do not try to reconnect
        if (client._state.abortConnectToBitcoinNetworkTimeout || client._state.connectToBitcoinNetworkAttempts > 3) {
          this.go(client, '../Stopping/disconnecting_from_bitcoin_p2p_network')
          return
        }

        // retry in 10s
        setTimeout(() => {
          // if we cancelled while waiting to reconnect, do not reconnect
          if (client._state.abortConnectToBitcoinNetworkTimeout) {
            this.go(client, '../Stopping/disconnecting_from_bitcoin_p2p_network')
          } else {
            client._state.connectToBitcoinNetworkAttempts++
            client.connectToBitcoinNetwork()
          }
        }, client.getConfig().timeBetweenReconnectAttempts || 10000)
      },
      _reset: 'uninitialized'
    },

    loading_torrents: {
      _onEnter: function (client) {
        client.loadTorrentsFromDatabase()
      },
      finished_loading: function (client) {
        this.go(client, '../Started')
      },
      failed: function (client, err) {
        client.lastError = {
          state: this.compositeState(client),
          error: err
        }
        this.handle(client, 'finished_loading')
      },
      _reset: 'uninitialized'
    }
  }
})

module.exports = Starting
