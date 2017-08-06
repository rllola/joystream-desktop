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
            client.store.setTorrentsToTerminate(client.torrents.length)
            client.store.setTorrentTerminatingProgress(0)

            if (client.torrents.size === 0) {
              this.transition(client, 'DisconnectingFromBitcoinNetwork')
              return
            }

            client.torrents.forEach(function (torrent, infoHash) {
              client.store.torrentRemoved(infoHash)
              torrent.terminate()

              const currentState = torrent.currentState()

              // check if terminated
              if (torrentHasTerminated(currentState)) {
                return client.processStateMachineInput('torrentTerminated', infoHash, torrent)
              }

              // listen for transition to Terminated state
              torrent.on('transition', function ({transition, state}) {
                if (torrentHasTerminated(state)) {
                  client.processStateMachineInput('torrentTerminated', infoHash, torrent)
                }
              })
            })
          },

          torrentTerminated: function (client, infoHash, torrent) {
            console.log('Terminated:', infoHash)
            client.torrents.delete(infoHash)

            torrent.removeAllListeners()

            if (client.torrents.size === 0) {
              client.processStateMachineInput('terminatedAllTorrents')
            }
          },

          terminatedAllTorrents: function (client) {
            this.transition(client, 'DisconnectingFromBitcoinNetwork')
          }
        },

        DisconnectingFromBitcoinNetwork: {
          _onEnter: async function (client) {
            await client.services.spvnode.disconnect()
            client.processStateMachineInput('disconnectedFromBitcoinNetwork')
          },
          disconnectedFromBitcoinNetwork: function (client) {
            this.transition(client, 'ClosingWallet')
          }
        },

        ClosingWallet: {
          _onEnter: function (client) {
            client.services.wallet.removeAllListeners()
            client.services.wallet = null
            client.processStateMachineInput('closedWallet')
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

            client.processStateMachineInput('stoppedSpvNode')
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
                client.processStateMachineInput('closedDatabase')
              })
            } else {
              client.processStateMachineInput('closedDatabase')
            }
          },
          closedDatabase: function (client) {
            this.transition(client, 'ClearingResources')
          }
        },

        ClearingResources: {
          _onEnter: function (client) {
            client.services.testnetFaucet = null
            client.services.spvnode = null

            if (client.services.session) {
              if (client.services.torrentUpdateInterval) {
                clearInterval(client.services.torrentUpdateInterval)
                client.services.torrentUpdateInterval = null
              }

              // TODO: update joystream-node session (to clearInterval)
              client.services.session.pauseLibtorrent((err) => {
                client.services.sesison = null
                client.processStateMachineInput('clearedResources')
              })
            } else {
              client.processStateMachineInput('clearedResources')
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

function torrentHasTerminated (state) {
  return state.startsWith('Terminated')
}

module.exports = Stopping
