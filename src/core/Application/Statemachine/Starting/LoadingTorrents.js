const BaseMachine = require('../../../BaseMachine')

// Use service factories instead
const TorrentStore = require('../../../Torrent/TorrentStore').default
const Torrent = require('../../../Torrent/Torrent').default

var LoadingTorrents = new BaseMachine({
  namespace: 'LoadingTorrents',

  initializeMachine : function (options) {

  },

  states: {

    uninitialized: {

    },

    GettingInfoHashes: {

      _onEnter: async function (client) {
        // Get infohashes of all persisted torrents
        client.torrentInfoHashesInDatabase = []

        try {
          client.torrentInfoHashesInDatabase = await client.services.db.getInfoHashes()
        } catch (err) {
          return this.queuedHandle(client, 'completedLoadingTorrents', err)
        }

        this.queuedHandle(client, 'gotInfoHashes', client.torrentInfoHashesInDatabase.length)
      },

      gotInfoHashes: function (client, numberOfTorrentsToLoad) {
        client.store.setTorrentsToLoad(numberOfTorrentsToLoad)

        if (numberOfTorrentsToLoad > 0) {
          this.transition(client, 'AddingTorrentsToSession')
        } else {
          this.queuedHandle(client, 'completedLoadingTorrents')
        }
      },

      _reset: 'uninitialized'
    },

    AddingTorrentsToSession: {
      _onEnter: async function (client) {
        var torrentStores = []

        while (client.torrentInfoHashesInDatabase.length) {
          const infoHash = client.torrentInfoHashesInDatabase.shift()

          let params
          let deepInitialState = 3 // Passive
          let extensionSettings = {} // no seller or buyer terms

          try {
            params = await client.services.db.getTorrentAddParameters(infoHash)

            if (!params) continue

            // TODO: Get Persisted deepInitialState and extensionSettings

          } catch (err) {
            client.reportError(err)
            continue
          }

          let torrentStore
          let coreTorrent

          //torrentStore = client.services.instantiateTorrentStore(params) // application should setup the handlers

          const noop = () => {}

          // TODO: update torrent store ctor .. use default values instead of passing zeros here, and remaining
          // values are @computed from metadata
          torrentStore = new TorrentStore(infoHash, '', 0, 0, infoHash, 0, 0, 0, 0, 0, {
            startHandler: noop,
            stopHandler: noop,
            removeHandler: noop,
            openFolderHandler: noop,
            startPaidDownloadHandler: noop,
            beginUploadHandler: noop,
            endUploadHandler: noop
          })

          torrentStores.push(torrentStore)

          client.store.torrentAdded(torrentStore)

          //coreTorrent = client.services.instantiateTorrent(torrentStore)
          coreTorrent = new Torrent(torrentStore)

          coreTorrent.startLoading(infoHash, params.name, params.savePath, params.resumeData, params.ti, deepInitialState, extensionSettings)

          /*
          // Whether torrent should be added in (libtorrent) paused mode from the get go
          var addAsPaused = Common.isStopped(deepInitialState)

          // Automanagement: We never want this, as our state machine should explicitly control
          // pause/resume behaviour torrents for now.
          //
          // Whether libtorrent is responsible for determining whether it should be started or queued.
          // Queuing is a mechanism to automatically pause and resume torrents based on certain criteria.
          // The criteria depends on the overall state the torrent is in (checking, downloading or seeding).
          var autoManaged = false
          */

          // set param flags - auto_managed/paused

          let torrent

          try {
            torrent = await addTorrentToSession(client.services.session, params)
          } catch (err) {
            client.reportError(err)
            coreTorrent.addTorrentResult(err)
            continue
          }

          // Torrent added to session inform the torrent state machine
          coreTorrent.addTorrentResult(null, torrent)

          // keep an array of the core torrents on the client and a Map infoHash=>torrentStore mapping?
          // client.torrents.set(infoHash, torrentStore)
        }

        this.queuedHandle(client, 'torrentsAddedToSession', torrentStores)
      },

      torrentsAddedToSession: function (client, torrents) {
        client.torrentsLoading = torrents

        this.transition(client, 'WaitingForTorrentsToFinishLoading')
      },
      _reset: 'uninitialized'
    },

    WaitingForTorrentsToFinishLoading: {
      _onEnter: function (client) {
        var totalTorrents = client.torrentsLoading.length

        // async .. wait for all torrent to complete loading

        this.queuedHandle(client, 'completedLoadingTorrents') // on parent machine
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

module.exports = LoadingTorrents
