const BaseMachine = require('../../../BaseMachine')

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

        this.queuedHandle(client, 'gotInfoHashes', client.torrentInfoHashesInDatabase)
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
        var torrents = []
        var totalTorrents = client.torrentInfoHashesInDatabase.length

        while (client.torrentInfoHashesInDatabase.length) {
          client.store.setTorrentLoadingProgress(1 - (client.torrentInfoHashesInDatabase.length / totalTorrents))
          const infoHash = client.torrentInfoHashesInDatabase.shift()

          let torrent
          try {
            let params = await client.services.db.getTorrentAddParameters(infoHash)
            if (!params) continue
            torrent = await addTorrentToSession(client.services.session, params)
          } catch (err) {
            continue
          }

          torrents.push(torrent)
        }

        this.queuedHandle(client, 'torrentsAddedToSession', torrents)
      },
      torrentsAddedToSession: function (client, torrents) {
        // create torrent stores and core Torrents
        // client.store.torrentAdded(torrent)
        // keep an array of the core torrents on the client
        this.transition(client, 'WaitingForTorrentsToFinishLoading')
      },
      _reset: 'uninitialized'
    },
    WaitingForTorrentsToFinishLoading: {
      _onEnter: function (client) {
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
