const BaseMachine = require('../../../BaseMachine')

// Either Common should be exported, or .is* functions should be exported,
// or these values should be here. Calling TorrentCommon is just a temporary fix until this is fixed
// see: https://github.com/JoyStream/joystream-electron/issues/215
const TorrentCommon = require('../../../Torrent/Statemachine/Common')

const Common = require('../Common')

//const TorrentState = require('joystream-node').TorrentState
const TorrentInfo = require('joystream-node').TorrentInfo

var LoadingTorrents = new BaseMachine({
  namespace: 'LoadingTorrents',

  initializeMachine : function (options) {

  },

  states: {

    uninitialized: {

    },

    AddingTorrents: {
      _onEnter: async function (client) {
        try {
          // Read all torrents from database
          var torrents = await client.services.db.getAll('torrents')
        } catch (err) {
          client.processStateMachineInput('completedLoadingTorrents')
          return
        }

        client.processStateMachineInput('gotTorrents', torrents)
      },

      gotTorrents: function (client, savedTorrents) {
        if (savedTorrents.length === 0) {

          client.processStateMachineInput('completedLoadingTorrents')

        } else {
          var addParameters = []

          // Create core torrent objects and stores, initialize with loading settings,
          // and prepare torrent add parameters
          savedTorrents.forEach(function (savedTorrent) {
            const infoHash = savedTorrent.infoHash

            let store = client.factories.torrentStore(infoHash)

            let coreTorrent = client.factories.torrent(store)

            // THIS UNINSTALLS ITSELF, BUT ITS IMPOSSIBLE TO SEE,
            // DEAL WITH THIS LATER!!!
            function handleTransition ({transition, state}) {
              if (state.startsWith('Active') || state.startsWith('Loading.FailedAdding')) {
                coreTorrent.removeListener('transition', handleTransition)
                client.processStateMachineInput('torrentLoaded')
              } else if (state.startsWith('Loading.WaitingForMissingBuyerTerms')) {
                client.processStateMachineInput('torrentWaitingForMissingBuyerTerms', coreTorrent)
              }
            }

            coreTorrent.on('transition', handleTransition)

            coreTorrent.on('transition', function ({transition, state}) {

                if(state.startsWith('Active.FinishedDownloading.Passive'))
                    client.processStateMachineInput('torrentFinishedDownloading', infoHash)

            })

            let metadata = new TorrentInfo(Buffer.from(savedTorrent.metadata, 'base64'))

            if (savedTorrent.resumeData) {
              var resumeData = Buffer.from(savedTorrent.resumeData, 'base64')
            }

            coreTorrent.startLoading(infoHash, savedTorrent.name, savedTorrent.savePath, resumeData, metadata, savedTorrent.deepInitialState, savedTorrent.extensionSettings)

            client.torrents.set(infoHash, coreTorrent)

            client.store.torrentAdded(store)

            let params = {
              name: savedTorrent.name,
              savePath: savedTorrent.savePath,
              ti: metadata
            }

            // joystream-node decoder doesn't correctly check if resumeData propery is undefined, it only checks
            // if the key on the params object exists so we need to conditionally set it here.
            if (resumeData) params.resumeData = resumeData

            // Whether torrent should be added in (libtorrent) paused mode from the get go
            let addAsPaused = TorrentCommon.isStopped(savedTorrent.deepInitialState)

            // Automanagement: We never want this, as our state machine should explicitly control
            // pause/resume behaviour torrents for now.
            //
            // Whether libtorrent is responsible for determining whether it should be started or queued.
            // Queuing is a mechanism to automatically pause and resume torrents based on certain criteria.
            // The criteria depends on the overall state the torrent is in (checking, downloading or seeding).
            let autoManaged = false

            // set param flags - auto_managed/paused
            params.flags = {
              paused: addAsPaused,
              auto_managed: autoManaged
            }

            addParameters.push({params, coreTorrent})
          })

          // Add the torrents to libtorrent session
          addParameters.forEach(function ({params, coreTorrent}) {
            client.services.session.addTorrent(params, function (err, torrent) {
              client.processStateMachineInput('torrentAdded', err, torrent, coreTorrent)
            })
          })
        }
      },

      torrentAdded: function (client, err, torrent, coreTorrent) {
        coreTorrent.addTorrentResult(err, torrent)

      },

      torrentWaitingForMissingBuyerTerms: function (client, torrent) {

        // Standard buyer terms
        // NB: Get from settings data store of some sort
        let terms = Common.getStandardbuyerTerms()

        // change name
        torrent.updateBuyerTerms(terms)
      },

      torrentLoaded: function (client) {
        var allTorrentsLoaded = true

        client.torrents.forEach(function (torrent, infoHash) {
          if (torrent.currentState().startsWith('Loading.CheckingPartialDownload') ||
              torrent.currentState().startsWith('Loading.WaitingForMissingBuyerTerms')) allTorrentsLoaded = false
        })

        if (allTorrentsLoaded) {
          client.processStateMachineInput('completedLoadingTorrents')
        }
      },

      _reset: 'uninitialized'
    }
  }
})

module.exports = LoadingTorrents
