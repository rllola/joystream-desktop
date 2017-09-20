/**
 * Created by bedeho on 11/06/17.
 */
 import path from 'path'

const BaseMachine = require('../../BaseMachine')

const Starting = require('./Starting/Starting')
const Started = require('./Started/Started')
const Stopping = require('./Stopping/Stopping')

const Common = require('./Common')

const {shell} = require('electron')

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
          client.processStateMachineInput('walletBalanceUpdated', balance)
        })

        client.getWalletBalance(function (balance) {
          client.processStateMachineInput('walletBalanceUpdated', balance)
        })
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

      torrentWaitingForMissingBuyerTerms: function (client, torrent) {

          // Standard buyer terms
          // NB: Get from settings data store of some sort
          let terms = Common.getStandardBuyerTerms()

          // change name
          torrent.updateBuyerTerms(terms)
      },

      walletBalanceUpdated: function (client, balance) {
        // Update UI
        client.store.setUnconfirmedBalance(balance.unconfirmed)
        client.store.setConfirmedBalance(balance.confirmed)

        // Automatically request testnet coins
        if (balance.unconfirmed < 25000) {
          client.topUpWalletFromFaucet(function (err) {
            if (err) {
              console.log('Faucet:', err)
            } else {
              console.log('Faucet: Request accepted')
            }
          })
        }
      },

      removeTorrent: function (client, infoHash, deleteData) {
        var fullPath
        var torrent = client.torrents.get(infoHash)

        if (deleteData) {
          // retrieve path before deleting
          var torrentInfo = torrent._client.getTorrentInfo()
          var name = torrentInfo.name()
          var savePath = torrent._client.getSavePath()
          fullPath = path.join(savePath, name, path.sep)
        }

        torrent.terminate()

        // Remove the torrent from the session
        client.services.session.removeTorrent(infoHash, function () {

        })

        // Remove the torrent from the db
        client.services.db.remove('torrents', infoHash).then(() => {

        })

        // Delete torrent from the client map
        client.torrents.delete(infoHash)

        // Remove the torrent from the applicationStore
        client.store.torrentRemoved(infoHash)

        // If deleteData we want to remove the folder/file
        if (fullPath && deleteData) {
          shell.moveItemToTrash(fullPath)
        }
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
