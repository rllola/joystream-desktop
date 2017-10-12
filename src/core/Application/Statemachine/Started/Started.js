/**
 * Created by bedeho on 12/06/17.
 */
const BaseMachine = require('../../../BaseMachine')
const OnCompletedScene = require('./OnCompletedScene')
const OnDownloadingScene = require('./OnDownloadingScene')
const OnUploadingScene = require('./OnUploadingScene')
const constants = require('../../../../constants')

const open = require('open')

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

      OnCommunityScene: {

          completed_scene_selected: function (client) {
              this.transition(client, 'OnCompletedScene')
          },

          downloading_scene_selected: function (client) {
              this.transition(client, 'OnDownloadingScene')
          },

          uploading_scene_selected: function (client) {
              this.transition(client, 'OnUploadingScene')
          },

          telegramClicked: function (client) {
              open(constants.TELEGRAM_URL)
          },

          slackClicked: function (client) {
              open(constants.SLACK_URL)
          },

          redditClicked: function (client) {
              open(constants.REDDIT_URL)
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
