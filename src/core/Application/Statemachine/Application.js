/**
 * Created by bedeho on 11/06/17.
 */
const BaseMachine = require('../../BaseMachine')

const Starting = require('./Starting/Starting')
const Started = require('./Started/Started')
const Stopping = require('./Stopping/Stopping')

const TorrentInfo = require('joystream-node').TorrentInfo

var ApplicationStateMachine = new BaseMachine({
  namespace: 'Application',
  initialState: 'NotStarted',
  initializeMachine: function (options) {

  },

  states: {
    NotStarted: {
      start: function (client, config) {
        client.config = config
        client.services = {}
        client.torrents = new Map()

        this.go(client, 'Starting/InitializingResources')
      }
    },

    Starting: {
      _child: Starting,

      //stop: allow user to cancel startup process / client.abortStarting = true
      //in each state of the starting machine before transitioning to next step it can
      //check this bool

      onBeforeUnloadMainWindow: function(client, event) {

          // We are initiating stop, so block window closing for the moment,
          // the main process will later trigger a second close request when we are in
          // `NotStarted`, which which we dont block.
          event.returnValue = false

          // Initiate stopping
          this.handle(client, 'stop')
      }
    },

    Started: {
      _child: Started,

      _onEnter: function (client) {
        // listen for changes in wallet balance
        client.services.wallet.on('balance', (balance) => {
          client.processStateMachineInput('walletBalanceChanged', balance)
        })

        client.processStateMachineInput('checkIfWalletNeedsRefill')
      },

      stop: function (client) {
        this.go(client, 'Stopping/TerminatingTorrents')
      },

      onBeforeUnloadMainWindow: function(client, event) {

          // We are initiating stop, so block window closing for the moment,
          // the main process will later trigger a second close request when we are in
          // `NotStarted`, which which we dont block.
          event.returnValue = false

          // Initiate stopping
          this.handle(client, 'stop')
      },

      startTorrent: function (client, infoHash) {
        var torrent = client.torrents.get(infoHash)
        torrent.start()
      },

      stopTorrent: function (client, infoHash) {
        var torrent = client.torrents.get(infoHash)
        torrent.stop()
      },

      removeTorrent: function (client, infoHash, deleteData) {
        var torrent = client.torrents.get(infoHash)
        //torrent.terminate()
        //if(deleteData) delete files
        //remove from libtorrent session
      },

      openTorrentFolder: function (client, infoHash) {
        var torrent = client.torrents.get(infoHash)
        //openFolder(torrent.torrent.handle.torrentFile().savePath)
      },

      updateBuyerTerms: function (client, infoHash, buyerTerms) {
        var torrent = client.torrents.get(infoHash)
        torrent.updateBuyerTerms(buyerTerms)
      },

      updateSellerTerms: function (client, infoHash, sellerTerms) {
        var torrent = client.torrents.get(infoHash)
        torrent.updateSellerTerms(sellerTerms)
      },

      startPaidDownload: function (client, infoHash) {
        var torrent = client.torrents.get(infoHash)
        // start downloading from cheapest sellers
        torrent.startPaidDownload(function (sellerA, sellerB) {
          const termsA = sellerA.connection.announcedModeAndTermsFromPeer.seller.terms
          const termsB = sellerB.connection.announcedModeAndTermsFromPeer.seller.terms
          return termsA.minPrice - termsB.minPrice
        })
      },

      beingUpload: function (client, infoHash, sellerTerms) {
        var torrent = client.torrents.get(infoHash)
        torrent.beginUpload(sellerTerms)
      },

      endUpload: function (client, infoHash) {
        var torrent = client.torrents.get(infoHash)
        torrent.endUpload()
      },

      addNewTorrent: function (client, torrentFilePath, deepInitialState, extensionSettings) {
        // Create a TorrentInfo from the file
        try {
          var ti = new TorrentInfo(torrentFilePath)
        } catch (err) {
          console.log(err)
          return
        }

        const infoHash = ti.infoHash()

        if (client.torrents.has(infoHash)) {
          console.log('Torrent Already Exists')
          // change scene to where the torrent is currently displayed?
          return
        }

        let torrentStore = client.factories.torrentStore(infoHash)
        let coreTorrent = client.factories.torrent(torrentStore)

        coreTorrent.startLoading(infoHash, ti.name() || infoHash, client.directories.defaultSavePath(), null, ti, deepInitialState, extensionSettings)

        let addParams = {
          ti: ti,
          name: ti.name() || infoHash,
          savePath: client.directories.defaultSavePath(),
          flags: {
            paused: true,
            auto_managed: false
          }
        }

        client.services.session.addTorrent(addParams, (err, torrent) => {
          if (err) {
            client.reportError(err)
            coreTorrent.addTorrentResult(err)
            return
          }

          client.processStateMachineInput('newTorrentAdded', torrent, coreTorrent, torrentStore)
        })
      },

      newTorrentAdded: function (client, torrent, coreTorrent, torrentStore) {
        console.log('Added New Torrent:', torrent.infoHash)

        torrent.on('lastPaymentReceived', function (alert) {
          client.processStateMachineInput('lastPaymentReceived', alert)
        })

        client.torrents.set(torrent.infoHash, coreTorrent)
        coreTorrent.addTorrentResult(null, torrent)

        client.store.setTorrentBeingAdded(torrentStore)
        client.store.torrentAdded(torrentStore)
      },

      checkIfWalletNeedsRefill: async function (client, balance) {
        if (client.services.spvnode.network !== 'testnet') return
        if (!client.services.testnetFaucet) return

        if (!balance) {
          // Check balance on startup
          try {
            balance = await client.services.wallet.getBalance()
          } catch (err) {
            return
          }
        }

        client.processStateMachineInput('topUpWalletFromFaucet', balance.unconfirmed)
      },

      topUpWalletFromFaucet: function (client, balance) {
        if (!client.services.testnetFaucet) return

        // Only top up if we are running low
        if (balance > 25000) {
          return
        }

        var address = client.services.wallet.getAddress()

        console.log('Faucet: Requesting some testnet coins...')

        client.services.testnetFaucet.getCoins(address.toString(), function (err) {
          if (err) {
            console.log('Faucet:', err)
          } else {
            console.log('Faucet: Received testnet coins')
          }
        })
      },

      walletBalanceChanged: function (client, balance) {
        client.processStateMachineInput('checkIfWalletNeedsRefill', balance)
      },

      lastPaymentReceived: function (client, alert) {
        if (!alert.settlementTx) return

        client.broadcastRawTransaction(alert.settlementTx)
      }
    },

    Stopping: {
      _child: Stopping,

      onBeforeUnloadMainWindow: function(client, event) {

        // We are already stopping, so block this close request.
        event.returnValue = false

      }
    }
  }
})

module.exports = ApplicationStateMachine
