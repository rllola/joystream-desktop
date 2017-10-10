/**
 * Created by bedeho on 12/06/17.
 */

const BaseMachine = require('../../../BaseMachine')
const LoadingTorrents = require('./LoadingTorrents')
const constants = require('../../../../constants')

var Starting = new BaseMachine({
  namespace: 'Starting',
  initializeMachine : function (options) {

  },
  states: {
    uninitialized: {

    },
    InitializingResources: {
      _onEnter: function (client) {
        try {
          // Get directories service resource
          client.directories = client.factories.directories(client.config.appDirectory)

          // Ensure we have the directories we need
          client.directories.create()

          client.services.spvnode = client.factories.spvnode(
            client.config.network,
            client.config.logLevel,
            client.directories.walletPath())

          client.services.spvnode.on('synced', function (height) {
            client.processStateMachineInput('spvChainFullySynced', height)
          })

          // default session settings
          var sessionSettings = {
            // network port libtorrent session will open a listening socket on
            port: 0,
            // Assisted Peer Discovery (APD)
            assistedPeerDiscovery: true
          }

          // Configuration overrides default setting
          if ('bitTorrentPort' in client.config) {
            sessionSettings.port = client.config.bitTorrentPort
          }

          // Configuration overrides default setting
          if ('assistedPeerDiscovery' in client.config) {
            sessionSettings.assistedPeerDiscovery = client.config.assistedPeerDiscovery
          }

          client.services.session = client.factories.session(sessionSettings)

          client.services.torrentUpdateInterval = setInterval(() => {
            client.services.session.postTorrentUpdates()
          }, constants.POST_TORRENT_UPDATES_INTERVAL)

          // Get a function to call for openning the database store
          client.services.openDatabase = client.factories.db(client.directories.databasePath())

          client.services.testnetFaucet = client.factories.testnetFaucet()

          this.transition(client, 'initializingApplicationDatabase')

        } catch (err) {
          client.reportError(err)
          this.go(client, '../Stopping/ClearingResources')
        }
      },
      _reset: 'uninitialized'
    },

    initializingApplicationDatabase: {
      _onEnter: async function (client) {
          try {
            client.services.db = await client.services.openDatabase()
          } catch (err) {
            return client.processStateMachineInput('databaseInitializationFailure', err)
          }

          client.processStateMachineInput('databaseInitializationSuccess')
      },
      databaseInitializationSuccess: function (client) {
        this.transition(client, 'InitialializingSpvNode')
      },
      databaseInitializationFailure: function (client, err) {
        client.reportError(err)
        this.go(client, '../Stopping/ClosingApplicationDatabase')
      },
      _reset: 'uninitialized'
    },

    InitialializingSpvNode: {
      _onEnter: function (client) {
        // change to use async/await after http/net fix in bcoin
        client.services.spvnode.open((err) => {
          if (err) {
            client.processStateMachineInput('initialializingSpvNodeFailure', err)
          } else {
            client.processStateMachineInput('initialializingSpvNodeSuccess')
          }
        })
      },
      initialializingSpvNodeSuccess: function (client) {
        this.transition(client, 'OpeningWallet')
      },
      initialializingSpvNodeFailure: function (client, err) {
        client.reportError(err)
        this.go(client, '../Stopping/StoppingSpvNode')
      },
      _reset: 'uninitialized'
    },

    OpeningWallet: {
      _onEnter: async function (client) {
        try {
          client.services.wallet = await client.services.spvnode.getWallet()
        } catch (err) {
          return client.processStateMachineInput('openingWalletFailure', err)
        }

        // Check if wallet is not found do we get null or rejected promise?
        if (client.services.wallet) {
          client.processStateMachineInput('openingWalletSuccess')
        } else {
          client.processStateMachineInput('openingWalletFailure', new Error('primary wallet'))
        }
      },
      openingWalletSuccess: function (client) {
        this.transition(client, 'ConnectingToBitcoinP2PNetwork')
      },
      openingWalletFailure: function (client, err) {
        client.reportError(err)
        this.go(client, '../Stopping/ClosingWallet')
      },
      _reset: 'uninitialized'
    },

    ConnectingToBitcoinP2PNetwork: {
      _onEnter: async function (client) {
        try {
          await client.services.spvnode.connect()
        } catch (err) {
          return client.processStateMachineInput('connectingToBitcoinP2PNetworkFailure', err)
        }

        client.processStateMachineInput('connectingToBitcoinP2PNetworkSuccess')
      },
      connectingToBitcoinP2PNetworkSuccess: function (client) {
        this.go(client, 'LoadingTorrents/AddingTorrents')
      },
      connectingToBitcoinP2PNetworkFailure: function (client, err) {
        client.reportError(err)
        this.go(client, '../Stopping/DisconnectingFromBitcoinP2PNetwork')
      },
      _reset: 'uninitialized'
    },


    LoadingTorrents: {
      _child: LoadingTorrents,
      _reset: 'uninitialized',

      /**
      // When all torrent state machines have entered into final loaded state (so they are renderable)
      completedLoadingTorrents: function (client) {
        this.go(client, '../Started')
      }
      */

    }
  }
})

module.exports = Starting
