/**
 * Created by bedeho on 12/06/17.
 */

const BaseMachine = require('../../../BaseMachine')

var Starting = new BaseMachine({
  namespace: 'Starting',
  //initialState: 'uninitialized',
  initializeMachine : function (options) {

  },
  states: {
    uninitialized: {
      _onEnter: function (client) {
        const retries = client.getConfig().retryConnectingToBitcoinNetwork
        if (retries > 0) {
          client._state.connectToBitcoinNetworkAttemptsRemaining = retries
        } else {
          client._state.connectToBitcoinNetworkAttemptsRemaining = 1
        }
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
        client.reportError(err)
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
        client.reportError(err)
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
        client.reportError(err)
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
        client.reportError(err)
        this.go(client, '../Stopping/closing_wallet')
      },
      _reset: 'uninitialized'
    },

    connecting_to_bitcoin_p2p_network: {
      _onEnter: function (client) {
        if (client._state.connectToBitcoinNetworkAttemptsRemaining === 0) {
          this.go(client, '../Stopping/disconnecting_from_bitcoin_p2p_network')
          return
        }

        client._state.abortConnectToBitcoinNetwork = false
        client._state.connectToBitcoinNetworkAttemptsRemaining--

        // if options allows to start offline, don't connect

        client.connectToBitcoinNetwork()
      },
      connected: function (client) {
        if (client._state.abortConnectToBitcoinNetwork) {
          this.go(client, '../Stopping/disconnecting_from_bitcoin_p2p_network')
          return
        }

        this.transition(client, 'loading_torrents')
      },
      cancel: function (client) {
        client._state.abortConnectToBitcoinNetwork = true
      },
      failed: function (client, err) {
        client.reportError(err)

        if (client._state.connectToBitcoinNetworkAttemptsRemaining === 0 || client._state.abortConnectToBitcoinNetwork) {
          this.go(client, '../Stopping/disconnecting_from_bitcoin_p2p_network')
          return
        }

        this.transition(client, 'waiting_to_reconnect_to_bitcoin_p2p_network')
      },
      _reset: 'uninitialized'
    },

    waiting_to_reconnect_to_bitcoin_p2p_network: {
      _onEnter: function (client) {
        // Automatically try after 15s
        client._state.reconnectTimeout = setTimeout(function () {
          this.transition(client, 'connecting_to_bitcoin_p2p_network')
        }, 15000)
      },
      cancel: function (client) {
        this.go(client, '../Stopping/disconnecting_from_bitcoin_p2p_network')
      },
      force_retry: function (client) {
        this.transition(client, 'connecting_to_bitcoin_p2p_network')
      },
      _onExit: function (client) {
        clearTimeout(client._state.reconnectTimeout)
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
        client.reportError(err)
        this.handle(client, 'finished_loading')
      },
      _reset: 'uninitialized'
    }
  }
})

module.exports = Starting
