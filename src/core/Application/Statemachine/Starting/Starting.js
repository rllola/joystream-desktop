/**
 * Created by bedeho on 12/06/17.
 */

const BaseMachine = require('../../../BaseMachine')
const Directories = require('./directories')
const SPVNode = require('./spvnode')
const constants = require('../../constants')
const Session = require('joystream-node').Session
const TorrentsStorage = require('../../../db').default
const LoadingTorrents = require('./LoadingTorrents')

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
          client.directories = new Directories(client.config.appDirectory)

          client.directories.create()

          client.services.spvnode = new SPVNode(
            client.config.network,
            client.config.logLevel,
            directories.walletPath())

          client.services.session = new Session({
            port: client.config.bitTorrentPort || process.env.LIBTORRENT_PORT
          })

          client.services.torrentUpdateInterval = setInterval(() => {
            client.session.postTorrentUpdates()
          }, constants.POST_TORRENT_UPDATES_INTERVAL)

          this.transition(client, 'initializingApplicationDatabase')

        } catch (err) {
          this.go(client, '../Stopping/ClearingResources')
        }
      },
      _reset: 'uninitialized'
    },

    initializingApplicationDatabase: {
      _onEnter: async function (client) {
          const dbPath = client.directories.databasePath()

          try {
            client.services.db = await TorrentsStorage.open(dbPath, {
              // 'table' names to use
              'torrents': 'torrents',
              'resume_data': 'resume_data',
              'torrent_plugin_settings': 'torrent_plugin_settings'
            })

            this.queuedHandle('databaseInitializationSuccess')

          } catch (err) {
            this.queuedHandle('databaseInitializationFailure', err)
          }
      },
      databaseInitializationSuccess: function (client) {
        this.transition(client, 'InitialializingSpvNode')
      },
      databaseInitializationFailure: function (client, err) {
        this.go(client, '../Stopping/ClosingApplicationDatabase')
      },
      _reset: 'uninitialized'
    },

    InitialializingSpvNode: {
      _onEnter: function (client) {
        // change to use async/await after http/net fix in bcoin
        client.services.spvnode.open((err) => {
          if (err) {
            this.queuedHandle('initialializingSpvNodeFailure', err)
          } else {
            this.queuedHandle('initialializingSpvNodeSuccess')
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
          return this.queuedHandle(client, 'openingWalletFailure', err)
        }

        // Check if wallet is not found to we get null or rejected promise?
        if (client.services.wallet) {
          this.queuedHandle(client, 'openingWalletSuccess')
        } else {
          this.queuedHandle(client, 'openingWalletFailure', new Error('primary wallet'))
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
          return this.queuedHandle(client, 'connectingToBitcoinP2PNetworkFailure', err)
        }

        this.queuedHandle(client, 'connectingToBitcoinP2PNetworkSuccess')
      },
      connectingToBitcoinP2PNetworkSuccess: function (client) {
        this.go(client, 'LoadingTorrents/GettingInfoHashes')
      },
      connectingToBitcoinP2PNetworkFailure: function (client, err) {
        client.reportError(err)
        this.go(client, '../Stopping/DisconnectingFromBitcoinP2PNetwork')
      },
      _reset: 'uninitialized'
    },

    LoadingTorrens: {
      _child: LoadingTorrents,
      _reset: 'uninitialized',
      // When all torrent state machines have entered into its final loaded state (so they are renderable)
      completedLoadingTorrents: function (client) {
        this.go(client, '../Started')
      }
    }
  }
})

module.exports = Starting
