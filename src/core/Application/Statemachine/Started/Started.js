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
        _child: OnCompletedScene
      },

      OnDownloadingScene: {
        _child: OnDownloadingScene
      },

      OnUploadingScene: {
        _child: OnUploadingScene
      }
    }
})

module.exports = Started
