const BaseMachine = require('../../../BaseMachine')

const Common = require('../../../Torrent/Statemachine/Common')

const TorrentState = require('joystream-node').TorrentState
const TorrentInfo = require('joystream-node').TorrentInfo

var LoadingTorrents = new BaseMachine({
  namespace: 'LoadingTorrents',

  initializeMachine : function (options) {

  },

  states: {

    uninitialized: {

    },

    GettingInfoHashes: {

      _onEnter: async function (client) {
        try {
          // Get infohashes of all persisted torrents
          var infoHashes = await client.services.db.getAllKeys('torrents')
        } catch (err) {
          client.reportError(err)
        }

        if (infoHashes) {
          client.infoHashesToLoad = infoHashes
          client.store.setTorrentsToLoad(infoHashes.length)

          if (infoHashes.length > 0) {
            this.transition(client, 'AddingTorrentsToSession')
          } else {
            client.processStateMachineInput('completedLoadingTorrents')
          }
        } else {
          client.processStateMachineInput('completedLoadingTorrents')
        }
      },

      _reset: 'uninitialized'
    },

    AddingTorrentsToSession: {
      _onEnter: function (client) {
        client.processStateMachineInput('getNextTorrent')
      },

      getNextTorrent: async function (client) {
          const infoHash = client.infoHashesToLoad.shift()

          if (infoHash) {
            client.processStateMachineInput('getTorrentAddParams', infoHash)
          } else {
            client.processStateMachineInput('finishedAddingTorrents')
          }
      },

      getTorrentAddParams: async function (client, infoHash) {

          try {
            var value = await client.services.db.getOne('torrents', infoHash)
          } catch (err) {
            client.reportError(err)
          }

          if (!value) {
            return client.processStateMachineInput('getNextTorrent')
          }

          client.processStateMachineInput('addTorrentToSession', infoHash, value)
      },

      addTorrentToSession: async function (client, infoHash, value) {
        let torrentStore = client.factories.torrentStore(infoHash)
        let coreTorrent = client.factories.torrent(torrentStore)

        let params = {
          name: value.name,
          savePath: value.savePath,
          ti: new TorrentInfo(Buffer.from(value.metadata, 'base64')) // metadata
        }

        if (value.resumeData) {
          params.resumeData = Buffer.from(value.resumeData, 'base64')
        }

        coreTorrent.startLoading(infoHash, value.name, value.savePath, params.resumeData, params.ti, value.deepInitialState, value.extensionSettings)

        // Whether torrent should be added in (libtorrent) paused mode from the get go
        var addAsPaused = Common.isStopped(value.deepInitialState)

        // Automanagement: We never want this, as our state machine should explicitly control
        // pause/resume behaviour torrents for now.
        //
        // Whether libtorrent is responsible for determining whether it should be started or queued.
        // Queuing is a mechanism to automatically pause and resume torrents based on certain criteria.
        // The criteria depends on the overall state the torrent is in (checking, downloading or seeding).
        var autoManaged = false

        // set param flags - auto_managed/paused
        params.flags = {
          paused: addAsPaused,
          auto_managed: autoManaged
        }

        client.services.session.addTorrent(params, function (err, torrent) {
          if (err) {
            client.reportError(err)
            client.processStateMachineInput('getNextTorrent')
          } else {
            client.processStateMachineInput('torrentAdded', torrent, torrentStore, coreTorrent)
          }
        })
      },

      torrentAdded: function (client, torrent, torrentStore, coreTorrent) {
        client.torrentsLoading.set(torrent.infoHash, coreTorrent)

        torrent.on('lastPaymentReceived', function (alert) {
          client.processStateMachineInput('lastPaymentReceived', alert)
        })

        coreTorrent.addTorrentResult(null, torrent)

        client.store.torrentAdded(torrentStore)

        client.processStateMachineInput('getNextTorrent')
      },

      finishedAddingTorrents: function (client) {
        if (client.torrentsLoading.size > 0) {
          this.transition(client, 'WaitingForTorrentsToFinishLoading')
        } else {
          client.processStateMachineInput('completedLoadingTorrents') // on parent machine
        }
      },

      _reset: 'uninitialized'
    },

    WaitingForTorrentsToFinishLoading: {
      // TODO: How to handle torrents that might get stuck trying to fetch metadata
      // If we don't persist torrents without metadata its not really a problem
      _onEnter: function (client) {
        client.torrentsLoading.forEach(function (torrent, infoHash) {
          // listen for transition out of loading state
          torrent.on('transition', function ({transition, state}) {
            // check if already Loaded
            if (state.startsWith('Active')) {
              return client.processStateMachineInput('torrentLoaded', infoHash, torrent)
            }

            // check if we need to set buyer terms
            if (state.startsWith('Loading.WaitingForMissingBuyerTerms')) {
              torrent.updateBuyerTerms(client.getStandardBuyerTerms())
            }
          })

          torrent.on('status_update', function () {
            // throttle updates?
            client.processStateMachineInput('loadingProgressUpdate')
          })

          const state = torrent.currentState()

          // check if already Loaded
          if (state.startsWith('Active')) {
            return client.processStateMachineInput('torrentLoaded', infoHash, torrent)
          }

          // check if we need to set buyer terms
          if (state.startsWith('Loading.WaitingForMissingBuyerTerms')) {
            torrent.updateBuyerTerms(client.getStandardBuyerTerms())
          }
        })
      },

      loadingProgressUpdate: function (client) {
        // NOTE: If we include the torrents being loaded in the application store
        // The loading screen can do these calculations (the torrentStore has the totalSize and progress
        // computed values updated on status updates)
        var totalSize = 0
        var checkedSize = 0

        client.torrents.forEach(function (torrent) {
          let size = torrent._client.metadata.totalSize()
          totalSize += size
        })

        // Progress of loaded torrents is 100%
        checkedSize = totalSize

        client.torrentsLoading.forEach(function (torrent) {
          let size = torrent._client.metadata.totalSize()
          totalSize += size
          if (torrent._client.lastStatus)
            checkedSize += size * torrent._client.lastStatus.progress
        })

        if (totalSize > 0)
          client.store.setTorrentLoadingProgress(checkedSize / totalSize)
      },

      torrentLoaded: function (client, infoHash, torrent) {
        // remove from map of loading torrents
        client.torrentsLoading.delete(infoHash)

        // add to map of loaded torrents
        client.torrents.set(infoHash, torrent)

        torrent.removeAllListeners()

        if (client.torrentsLoading.size === 0) {
          client.processStateMachineInput('completedLoadingTorrents') // on parent machine
        }
      },
      _reset: 'uninitialized'
    }
  }
})

module.exports = LoadingTorrents
