/**
 * Created by bedeho on 12/06/17.
 */
const BaseMachine = require('../../../BaseMachine')
const OnCompletedScene = require('./OnCompletedScene')
const OnDownloadingScene = require('./OnDownloadingScene')
const OnUploadingScene = require('./OnUploadingScene')
const Scene = require('../../Scene')

import { SINTEL_ON_BOARDING_TORRENT } from '../../../../constants'
import { updateLatestVersionRunned } from '../../onboarding'
import { addTorrent, prepareTorrentParams} from '../Common'

var Started = new BaseMachine({
    namespace: "Started",
    initialState: 'OnDownloadingScene',
    initializeMachine: function (options) {

    },
    states: {
      OnCompletedScene: {
        _child: OnCompletedScene
      },

      OnDownloadingScene: {
        _child: OnDownloadingScene,

          torrentFinishedDownloading: function (client, infoHash) {
              torrentFinishedInBackground(client, infoHash)
          }
      },

      OnUploadingScene: {
        _child: OnUploadingScene,

          torrentFinishedDownloading: function (client, infoHash) {
              torrentFinishedInBackground(client, infoHash)
          }
      },
      OnBoarding: {
          onBoardingFinished: function (client) {

            updateLatestVersionRunned()

            var settings

            try {
              settings = prepareTorrentParams(client, SINTEL_ON_BOARDING_TORRENT)
            } catch (error) {
              console.error('Initialization of on boarding torrent file failed : ', error)
              return
            }

            addTorrent(client, settings)

            this.go(client, 'OnDownloadingScene')
          }
      }
    }
})

function torrentFinishedInBackground(client, infoHash) {

    // Since we not on the Completed scene,
    // we increment the background completion count
    client.store.setNumberCompletedInBackground(client.store.numberCompletedInBackground + 1)
}

module.exports = Started
