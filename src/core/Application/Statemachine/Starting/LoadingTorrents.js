const BaseMachine = require('../../../BaseMachine')

const Common = require('../Common')

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


        // Create core torrent objects and stores, initialize with loading settings,
        // and prepare torrent add parameters
        savedTorrents.forEach(function (savedTorrent) {

          // Add torrent
          Common.addTorrent(client, savedTorrent)

        })

        // øøø
        this.go(client, '../../Started')
      },

        /**
      torrentAdded: function (client, err, torrent, coreTorrent) {
        coreTorrent.addTorrentResult(err, torrent)

      },
         */
/**
      torrentWaitingForMissingBuyerTerms: function (client, torrent) {

        // Standard buyer terms
        // NB: Get from settings data store of some sort
        let terms = Common.getStandardbuyerTerms()

        // change name
        torrent.updateBuyerTerms(terms)
      },
*/
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
