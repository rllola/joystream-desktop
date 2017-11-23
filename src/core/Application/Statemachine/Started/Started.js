/**
 * Created by bedeho on 12/06/17.
 */
const BaseMachine = require('../../../BaseMachine')
const OnDownloadingScene = require('./OnDownloadingScene')
const OnUploadingScene = require('./OnUploadingScene')


var Started = new BaseMachine({
    namespace: "Started",
    initialState: 'OnDownloadingScene',
    initializeMachine: function (options) {

    },
    states: {
      OnDownloadingScene: {
        _child: OnDownloadingScene,

      },

      OnUploadingScene: {
        _child: OnUploadingScene,

      }

    }
})

module.exports = Started
