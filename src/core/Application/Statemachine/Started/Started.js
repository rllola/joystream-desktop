/**
 * Created by bedeho on 12/06/17.
 */
const BaseMachine = require('../../../BaseMachine')
const OnDownloadingScene = require('./OnDownloadingScene')

var Started = new BaseMachine({
    namespace: "Started",
    initialState: 'OnDownloadingScene',
    initializeMachine: function (options) {

    },
    states: {
      OnDownloadingScene: {
        _child: OnDownloadingScene,

      }

    }
})

module.exports = Started
