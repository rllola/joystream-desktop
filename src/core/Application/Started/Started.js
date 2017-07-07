/**
 * Created by bedeho on 12/06/17.
 */
import BaseMachine from '../../BaseMachine'
import OnCompletedScene from './OnCompletedScene'
import OnDownloadingScene from './OnDownloadingScene'
import OnUploadingScene from './OnUploadingScene'

var Started = new BaseMachine({
    namespace: "Started",
    initialState: "OnCompletedScene",
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

export default Started
