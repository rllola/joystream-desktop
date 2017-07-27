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
        torrent.core.start()
        console.log('application received startTorrent input', infoHash)
      },

      stopTorrent: function (client, infoHash) {
        var torrent = client.torrents.get(infoHash)
        if (!torrent) return
        torrent.core.stop()
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
        torrent.core.updateBuyerTerms(buyerTerms)
      },

      updateSellerTerms: function (client, infoHash, sellerTerms) {
        var torrent = client.torrents.get(infoHash)
        if (!torrent) return
        torrent.core.updateSellerTerms(sellerTerms)
      },

      startPaidDownload: function (client, infoHash) {
        var torrent = client.torrents.get(infoHash)
        if (!torrent) return
        torrent.core.startPaidDownload()
      },

      beingUpload: function (client, infoHash) {
        var torrent = client.torrents.get(infoHash)
        if (!torrent) return
        torrent.core.beginUpload()
      },

      endUpload: function (client, infoHash) {
        var torrent = client.torrents.get(infoHash)
        if (!torrent) return
        torrent.core.endUpload()
      },

      addNewTorrent: async function (client, torrentFilePath) {
        client.store.setTorrentBeingAdded(torrentStore)

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

        const deepInitialState = 3 // Passive
        const extensionSettings = {} // no seller or buyer terms

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

        let torrent

        try {
          torrent = await addTorrentToSession(client.services.session, addParams)
        } catch (err) {
          client.reportError(err)
          coreTorrent.addTorrentResult(err)
          return
        }

        client.processStateMachineInput('newTorrentAdded', torrent, coreTorrent, torrentStore)
      },

      newTorrentAdded: function (client, torrent, coreTorrent, torrentStore) {
        console.log('Added New Torrent:', torrent.infoHash)
        client.store.setTorrentBeingAdded(torrentStore)

        client.torrents.set(torrent.infoHash, {
          torrent: torrent,   // "joystream-node" torrent
          core: coreTorrent,  // Torrent
          store: torrentStore // TorrentStore
        })

        coreTorrent.addTorrentResult(null, torrent)

        client.store.torrentAdded(torrentStore)
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

function addTorrentToSession (session, params) {
  return new Promise(function (resolve, reject) {
    session.addTorrent(params, (err, torrent) => {
      if (err) {
        return reject(err)
      }

      resolve(torrent)
    })
  })
}

module.exports = ApplicationStateMachine
