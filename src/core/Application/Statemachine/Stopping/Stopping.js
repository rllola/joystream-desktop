/**
 * Created by bedeho on 12/06/17.
 */

const BaseMachine = require('../../../BaseMachine')

 var Stopping = new BaseMachine({
    namespace: "Stopping",
    //initialState: "uninitialized",
    initializeMachine: function (options) {

    },
    states: {
        uninitialized: {

        },
        terminating_torrents: {
          _onEnter: function (client) {
            client.terminateTorrents()
          },
          terminated: function (client) {
            this.transition(client, 'disconnecting_from_bitcoin_p2p_network')
          }
        },

        disconnecting_from_bitcoin_p2p_network: {
          _onEnter: function (client) {
            client.disconnectFromBitcoinNetwork()
          },
          disconnected: function (client) {
            this.transition(client, 'closing_wallet')
          }
        },

        closing_wallet: {
          _onEnter: function (client) {
            client.closeWallet()
          },
          closed: function (client) {
            this.transition(client, 'stopping_spv_node')
          }
        },

        stopping_spv_node: {
          _onEnter: function (client) {
            client.closeSpvNode()
          },
          closed: function (client) {
            this.transition(client, 'closing_application_database')
          }
        },

        closing_application_database: {
          _onEnter: function (client) {
            client.closeDatabase()
          },
          closed: function (client) {
            this.transition(client, 'clearing_resources')
          }
        },

        clearing_resources: {
          _onEnter: function (client) {
            client.clearResources()
          },
          cleared: function (client) {
            this.go(client, '../NotStarted')
          },
          _reset: 'uninitialized'
        }
    }
})

module.exports = Stopping
