/**
 * Created by bedeho on 12/06/17.
 */
const BaseMachine = require('../../../BaseMachine')
const OnCompletedScene = require('./OnCompletedScene')
const OnDownloadingScene = require('./OnDownloadingScene')
const OnUploadingScene = require('./OnUploadingScene')


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

      },

      OnUploadingScene: {
        _child: OnUploadingScene,

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
          }

      }

    }
})

module.exports = Started
