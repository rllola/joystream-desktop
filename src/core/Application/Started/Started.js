/**
 * Created by bedeho on 12/06/17.
 */
const BaseMachine = require('../../BaseMachine')
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
        _child: OnCompletedScene,
        _onEnter: function (client) {
          client.setActiveScene('Completed')
        }
      },

      OnDownloadingScene: {
        _child: OnDownloadingScene,
        _onEnter: function (client) {
          client.setActiveScene('Downloading')
        }
      },

      OnUploadingScene: {
        _child: OnUploadingScene,
        _onEnter: function (client) {
          client.setActiveScene('Seeding')
        }
      }
    }
})

module.exports = Started
