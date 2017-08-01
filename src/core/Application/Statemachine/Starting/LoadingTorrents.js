const BaseMachine = require('../../../BaseMachine')

const Common = require('../../../Torrent/Statemachine/Common')

const TorrentState = require('joystream-node').TorrentState

const noop = () => {}

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
          var infoHashes = await client.services.db.getInfoHashes()
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
          client.processStateMachineInput('completedLoadingTorrents', err)
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
          let params

          try {
            params = await client.services.db.getTorrentAddParameters(infoHash)
          } catch (err) {
            client.reportError(err)
          }

          if (!params) {
            return client.processStateMachineInput('getNextTorrent')
          }

          client.processStateMachineInput('addTorrentToSession', infoHash, params)
      },

      addTorrentToSession: async function (client, infoHash, params) {
        const deepInitialState = 3 // Passive
        const extensionSettings = {} // no seller or buyer terms

        let torrentStore = client.factories.torrentStore(infoHash)
        let coreTorrent = client.factories.torrent(torrentStore)

        coreTorrent.startLoading(infoHash, params.name, params.savePath, params.resumeData, params.ti, deepInitialState, extensionSettings)

        // Whether torrent should be added in (libtorrent) paused mode from the get go
        var addAsPaused = Common.isStopped(deepInitialState)

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
          checkedSize += size * torrent._client.lastStatus.progress
        })


        if (totalSize > 0)
          client.store.setTorrentLoadingProgress(checkedSize / totalSize)
      },

      torrentLoaded: function (client, infoHash, torrent) {
        console.log('Loaded', infoHash)

        // remove from map of loading torrents
        client.torrentsLoading.delete(infoHash)

        // add to map of loaded torrents
        client.torrents.set(infoHash, torrent)

        torrent.removeAllListeners()

        console.log('Total Torrents Loaded:', client.torrents.size, 'Remaining:', client.torrentsLoading.size)

        if (client.torrentsLoading.size === 0) {
          client.processStateMachineInput('completedLoadingTorrents') // on parent machine
        }
      },
      _reset: 'uninitialized'
    }
  }
})

module.exports = LoadingTorrents
