/**
 * Created by bedeho on 11/06/17.
 */
const BaseMachine = require('../../BaseMachine')

const Starting = require('./Starting/Starting')
const Started = require('./Started/Started')
const Stopping = require('./Stopping/Stopping')

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
        if (!torrent) return
        //torrent.core.start()
        console.log('application received startTorrent input', infoHash)
      },

      stopTorrent: function (client, infoHash) {
        var torrent = client.torrents.get(infoHash)
        if (!torrent) return
        //torrent.core.stop()
        console.log('application received stopTorrent input', infoHash)
      },

      removeTorrent: function (client, infoHash, deleteData) {
        var torrent = client.torrents.get(infoHash)
        if (!torrent) return
        //torrent.core.terminate()
        //if(deleteData) delete files
        //remove from libtorrent session
      },

      openTorrentFolder: function (client, infoHash) {
        var torrent = client.torrents.get(infoHash)
        if (!torrent) return
        //openFolder(torrent.torrent.handle.torrentFile().savePath)
      },

      updateBuyerTerms: function (client, infoHash, buyerTerms) {
        var torrent = client.torrents.get(infoHash)
        if (!torrent) return
        //torrent.core.updateBuyerTerms(buyerTerms)
      },

      updateSellerTerms: function (client, infoHash, sellerTerms) {
        var torrent = client.torrents.get(infoHash)
        if (!torrent) return
        //torrent.core.updateSellerTerms(sellerTerms)
      },

      startPaidDownload: function (client, infoHash) {
        var torrent = client.torrents.get(infoHash)
        if (!torrent) return
        //torrent.core.startPaidDownload()
      },

      beingUpload: function (client, infoHash) {
        var torrent = client.torrents.get(infoHash)
        if (!torrent) return
        //torrent.core.beginUpload()
      },

      endUpload: function (client, infoHash) {
        var torrent = client.torrents.get(infoHash)
        if (!torrent) return
        //torrent.core.endUpload()
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
