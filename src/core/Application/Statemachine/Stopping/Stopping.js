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
            if (client.torrents.size === 0) {
              this.transition(client, 'DisconnectingFromBitcoinNetwork')
            } else {
              client.torrents.forEach(function (torrent, infoHash) {
                //client.store.torrentRemoved(infoHash) // should we remove it?

                // Listen for transition to Terminated state
                torrent.on('transition', function ({transition, state}) {
                  if (state.startsWith('Terminated')) {
                    client.processStateMachineInput('torrentTerminated', torrent)
                  }
                })

                torrent.terminate()
              })
            }
          },

          torrentTerminated: function (client, infoHash, torrent) {
            var allTorrentsTerminated = true

            client.torrents.forEach(function (torrent, infoHash) {
              if (!torrent.currentState().startsWith('Terminated')) allTorrentsTerminated = false
            })

            if (allTorrentsTerminated) {
              this.transition(client, 'SavingTorrentsToDatabase')
            }
          },

          lastPaymentReceived: function (client, alert) {
            if (!alert.settlementTx) return

            client.broadcastRawTransaction(alert.settlementTx)
          }
        },

        SavingTorrentsToDatabase: {
            _onEnter: function (client) {
              var operations = []

              // Create batch put operations for each torrent
              client.torrents.forEach(function (torrent, infoHash) {
                var torrentClient = torrent._client

                if (!torrentClient.metadata || !torrentClient.metadata.isValid()) {

                  // do not persist torrents which did not have metadata
                  return

                } else {

                  let encoded = {
                    infoHash: infoHash,
                    name: torrentClient.name,
                    savePath: torrentClient.savePath,
                    deepInitialState: torrentClient.deepInitialState,
                    metadata: torrentClient.metadata.toBencodedEntry().toString('base64'),
                    extensionSettings: {
                      buyerTerms: torrentClient.buyerTerms,
                      sellerTerms: torrentClient.sellerTerms
                    }
                  }

                  if (torrentClient.resumeData) {
                    encoded.resumeData = torrentClient.resumeData.toString('base64')
                  }

                  operations.push({
                    type: 'put',
                    key: infoHash,
                    value: encoded
                  })
                }
              })

              // Save all the torrents to database
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

module.exports = Stopping
