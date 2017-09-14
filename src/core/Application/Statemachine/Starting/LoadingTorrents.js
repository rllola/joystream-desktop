const BaseMachine = require('../../../BaseMachine')
const TorrentInfo = require('joystream-node').TorrentInfo

const Common = require('../Common')

import { isRunningForTheFirstTime } from '../../onboarding'

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

          // Need to convert data from db into a torrentInfo
          savedTorrent.metadata = new TorrentInfo(Buffer.from(savedTorrent.metadata, 'base64'))

          // Add torrent
          Common.addTorrent(client, savedTorrent)

        })

        // If first time running the application show the on boarding message
        if (isRunningForTheFirstTime()) {
          this.go(client, '../../Started/OnBoarding')
        } else {
          // øøø
          this.go(client, '../../Started')
        }
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
