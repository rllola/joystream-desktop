/**
 * Created by bedeho on 12/06/17.
 */

var ipcRenderer = require('electron').ipcRenderer

const BaseMachine = require('../../../BaseMachine')

 var Stopping = new BaseMachine({
    namespace: "Stopping",
    initializeMachine: function (options) {

    },
    states: {
        uninitialized: {

        },
        TerminatingTorrents: {
          _onEnter: function (client) {
            //TODO: async ... client.torrents.forEach terminate... wait for completion
            client.store.setTorrentsToTerminate(client.torrents.length)
            client.store.setTorrentTerminatingProgress(1)
            this.handle(client, 'terminated')
          },
          terminated: function (client) {
            this.transition(client, 'DisconnectingFromBitcoinNetwork')
          }
        },

        DisconnectingFromBitcoinNetwork: {
          _onEnter: async function (client) {
            await client.services.spvnode.disconnect()
            this.handle(client, 'disconnectedFromBitcoinNetwork')
          },
          disconnectedFromBitcoinNetwork: function (client) {
            this.transition(client, 'ClosingWallet')
          }
        },

        ClosingWallet: {
          _onEnter: function (client) {
            client.services.wallet = null
            this.handle(client, 'closedWallet')
          },
          closedWallet: function (client) {
            this.transition(client, 'StoppingSpvNode')
          }
        },

        StoppingSpvNode: {
          _onEnter: async function (client) {
            try {
              if (client.services.spvnode) await client.services.spvnode.close()
            } catch (e) {}

            this.handle(client, 'stoppedSpvNode')
          },
          stoppedSpvNode: function (client) {
            this.transition(client, 'ClosingApplicationDatabase')
          }
        },

        ClosingApplicationDatabase: {
          _onEnter: function (client) {
            if (client.services.db) {
              client.services.db.close((err) => {
                client.services.db = null
                this.handle(client, 'closedDatabase')
              })
            } else {
              this.handle(client, 'closedDatabase')
            }
          },
          closedDatabase: function (client) {
            this.transition(client, 'ClearingResources')
          }
        },

        ClearingResources: {
          _onEnter: function (client) {
            client.torrents = []
            client.services.spvnode = null

            if (client.services.session) {
              if (client.services.torrentUpdateInterval) {
                clearInterval(client.services.torrentUpdateInterval)
                client.services.torrentUpdateInterval = null
              }

              // TODO: update joystream-node session (to clearInterval)
              client.services.session.pauseLibtorrent((err) => {
                client.services.sesison = null
                this.handle(client, 'clearedResources')
              })
            } else {
              this.handle(client, 'clearedResources')
            }
          },
          clearedResources: function (client) {

              // Tell main process about the application being done
              ipcRenderer.send('main-window-channel', 'user-closed-app')

              this.go(client, '../NotStarted')
          },
          _reset: 'uninitialized'
        }
    }
})

module.exports = Stopping
