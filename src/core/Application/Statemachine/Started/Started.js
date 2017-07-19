/**
 * Created by bedeho on 12/06/17.
 */
const BaseMachine = require('../../../BaseMachine')
const OnCompletedScene = require('./OnCompletedScene')
const OnDownloadingScene = require('./OnDownloadingScene')
const OnUploadingScene = require('./OnUploadingScene')
const Scene = require('../../Scene')

var Started = new BaseMachine({
    namespace: "Started",
    initialState: 'OnDownloadingScene',
    initializeMachine: function (options) {

    },
    states: {
      OnCompletedScene: {
        _child: OnCompletedScene,
        _onEnter: function (client) {
          client.setActiveScene(Scene.Completed)
        }
      },

      OnDownloadingScene: {
        _child: OnDownloadingScene,
        _onEnter: function (client) {
          client.setActiveScene(Scene.Downloading)
        }
      },

      OnUploadingScene: {
        _child: OnUploadingScene,
        _onEnter: function (client) {
          client.setActiveScene(Scene.Uploading)
        }
      }
    }
})

module.exports = Started
