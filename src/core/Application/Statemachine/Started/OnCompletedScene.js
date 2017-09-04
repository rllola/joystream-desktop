/**
 * Created by bedeho on 12/06/17.
 */

const BaseMachine = require('../../../BaseMachine')

var OnCompletedScene = new BaseMachine({
  initialState: 'idle',
  states: {
    idle: {

      _onEnter : function (client) {

        // Since we are going to the Completed scene,
        // we mark all as no longer completed in the background
        client.store.setNumberCompletedInBackground(0)
      },

      downloading_scene_selected: function (client) {
        this.go(client, '../OnDownloadingScene')
      },

      uploading_scene_selected: function (client) {
        this.go(client, '../OnUploadingScene')
      }
    }
  }
})

module.exports = OnCompletedScene
