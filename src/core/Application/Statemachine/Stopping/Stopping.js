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
            client.store.setTorrentsToTerminate(client.torrents.size)
            client.store.setTorrentTerminatingProgress(0)

            client._torrentsTerminating = client.torrents.size

            if (client._torrentsTerminating === 0) {
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
            torrent.removeAllListeners()

            client._torrentsTerminating--

            if (client._torrentsTerminating === 0) {
              client.processStateMachineInput('terminatedAllTorrents')
            }
          },

          terminatedAllTorrents: function (client) {
            this.transition(client, 'SavingTorrentsToDatabase')
          },

          lastPaymentReceived: function (client, alert) {
            if (!alert.settlementTx) return

            client.broadcastRawTransaction(alert.settlementTx)
          }
        },

        SavingTorrentsToDatabase: {
            _onEnter: function (client) {
              var operations = []

              function addSaveOperation (torrent) {
                var encoded = encodeTorrent(torrent._client)

                if(!encoded) return

                operations.push({
                  type: 'put',
                  key: encoded.infoHash,
                  value: encoded
                })
              }

              function encodeTorrent (torrentClient) {
                // do not persist torrents which did not receive metadata
                if (!torrentClient.metadata || !torrentClient.metadata.isValid()) return null

                var encoded = {
                  infoHash: torrentClient.infoHash,
                  name: torrentClient.name,
                  savePath: torrentClient.savePath,
                  deepInitialState: torrentClient.deepInitialState,
                  metadata: torrentClient.metadata.toBencodedEntry().toString('base64')
                }

                if (torrentClient.resumeData) {
                  encoded.resumeData = torrentClient.resumeData.toString('base64')
                }

                encoded.extensionSettings = {
                  buyerTerms: torrentClient.buyerTerms,
                  sellerTerms: torrentClient.sellerTerms
                }

                return encoded
              }

              client.torrents.forEach(function (torrent, infoHash) {
                addSaveOperation(torrent)
                client.torrents.delete(infoHash)
              })

              client.services.db.batch('torrents', operations, (err) => {
                client.processStateMachineInput('SavingTorrentsToDatabaseResult', err)
              })
            },

            SavingTorrentsToDatabaseResult: function (client, err) {
              if(err) client.reportError(err)
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
