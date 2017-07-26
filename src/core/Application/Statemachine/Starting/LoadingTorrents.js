const BaseMachine = require('../../../BaseMachine')

// Use service factories instead
const TorrentStore = require('../../../Torrent/TorrentStore').default
const Torrent = require('../../../Torrent/Torrent').default
const Common = require('../../../Torrent/Statemachine/Common')

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
        client.torrents = new Map()
        client.infoHashesToLoad = []
        client.store.setTorrentsToLoad(0)
        client.store.setTorrentLoadingProgress(0)

        try {
          // Get infohashes of all persisted torrents
          var infoHashes = await client.services.db.getInfoHashes()
        } catch (err) {
          return client.processStateMachineInput('completedLoadingTorrents', err)
        }

        client.processStateMachineInput('gotInfoHashes', infoHashes)
      },

      gotInfoHashes: function (client, infoHashes) {
        client.infoHashesToLoad = infoHashes
        client.store.setTorrentsToLoad(infoHashes.length)

        if (infoHashes.length > 0) {
          this.transition(client, 'AddingTorrentsToSession')
        } else {
          client.processStateMachineInput('completedLoadingTorrents')
        }
      },

      _reset: 'uninitialized'
    },

    AddingTorrentsToSession: {
      _onEnter: async function (client) {
        while (client.infoHashesToLoad.length) {
          const infoHash = client.infoHashesToLoad.shift()

          // skip duplicate
          if (client.torrents.has(infoHash)) continue

          let params
          const deepInitialState = 3 // Passive
          const extensionSettings = {} // no seller or buyer terms

          try {
            params = await client.services.db.getTorrentAddParameters(infoHash)

            if (!params) continue

            // TODO: Get Persisted deepInitialState and extensionSettings

          } catch (err) {
            client.reportError(err)
            continue
          }

          //torrentStore = client.services.instantiateTorrentStore(params) // application should setup the handlers

          // TODO: update torrent store ctor .. use default values instead of passing zeros here, and remaining
          // values are @computed from metadata
          let torrentStore = new TorrentStore(infoHash, '', 0, 0, infoHash, 0, 0, 0, 0, 0, {
            startHandler: noop,
            stopHandler: noop,
            removeHandler: noop,
            openFolderHandler: noop,
            startPaidDownloadHandler: noop,
            beginUploadHandler: noop,
            endUploadHandler: noop
          })


          //coreTorrent = client.services.instantiateTorrent(torrentStore)
          let coreTorrent = new Torrent(torrentStore)

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

          let torrent

          try {
            torrent = await addTorrentToSession(client.services.session, params)
          } catch (err) {
            client.reportError(err)
            coreTorrent.addTorrentResult(err)
            // Ignore adding failure. We currently don't have an appropriate scene to display this result
            continue
          }

          client.store.torrentAdded(torrentStore) // batch these at the end?

          // Torrent added to session inform the torrent state machine
          coreTorrent.addTorrentResult(null, torrent)

          client.torrents.set(infoHash, {
            torrent: torrent,   // "joystream-node" torrent
            core: coreTorrent,  // Torrent
            store: torrentStore // TorrentStore
          })
        }

        client.processStateMachineInput('torrentsAddedToSession')
      },

      torrentsAddedToSession: function (client) {
        if (client.torrents.size > 0) {
          this.transition(client, 'WaitingForTorrentsToFinishLoading')
        } else {
          client.processStateMachineInput('completedLoadingTorrents') // on parent machine
        }
      },
      _reset: 'uninitialized'
    },

    WaitingForTorrentsToFinishLoading: {
      _onEnter: async function (client) {
        var coreTorrents = []

        client.torrents.forEach(function (torrent) { coreTorrents.push(torrent.core) })

        // For a more accurate progress indicator, listen to status updates on torrents
        // and aggreate the % progress of each torrent weighted by the total size of each
        // or use a timer and get status of all torrents (progress property when torrent is in checking_files represents
        // progress of checking not downloading)
        var torrentsLoaded = 0

        function updateProgress () {
          client.store.setTorrentLoadingProgress(torrentsLoaded / coreTorrents.length)
        }

        function torrentLoaded (torrent) {
          torrentsLoaded++
          updateProgress()
          console.log('Total Torrents Loaded:', torrentsLoaded, 'Remaining:', coreTorrents.length - torrentsLoaded)
        }

        try {
          await Promise.all(coreTorrents.map(function (torrent) {
            return waitForTorrentToFinishLoading(torrent).then(torrentLoaded.bind(null, torrent))
          }))
        } catch (err) {
          client.reportError(err)
        }

        client.processStateMachineInput('completedLoadingTorrents') // on parent machine
      },
      _onExit: function (client) {
        // clear timer
      },
      _reset: 'uninitialized'
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

// Returns a promise that resolves after a torrent has reached a state where we can render it
// Either it leaves the Loading state, or is in "Loading:WaitingForMissingBuyerTerms" state
function waitForTorrentToFinishLoading (torrent) {
  function hasFinishedLoading (state) {
    if (state.startsWith('Active')) return true
    if (state.startsWith('Loading.WaitingForMissingBuyerTerms')) return true
    return false
  }

  function hasTerminated (state) {
    if (state.startsWith('Terminated')) return true
    return false
  }

  return new Promise(function (resolve, reject) {
    const currentState = torrent.currentState()

    if (hasFinishedLoading(currentState)) {
      return resolve()
    }

    if (hasTerminated(currentState)) {
      return reject()
    }

    function onStateChange ({transition, state}) {
      if (hasFinishedLoading(state)) {
        torrent.removeListener('transition', onStateChange)
        return resolve()
      } else if (hasTerminated(state)){
        torrent.removeListener('transition', onStateChange)
        return reject()
      }
    }

    // wait for state changes and check again
    torrent.on('transition', onStateChange)
  })
}

module.exports = LoadingTorrents
