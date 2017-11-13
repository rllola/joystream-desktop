/**
 * Created by bedeho on 12/06/17.
 */

const BaseMachine = require('../../../BaseMachine')

var OnCompletedScene = new BaseMachine({
  initialState: 'idle',
  states: {
    idle: {

      _onEnter : function (client) {

      },

      downloading_scene_selected: function (client) {
        this.go(client, '../OnDownloadingScene')
      },

      uploading_scene_selected: function (client) {
        this.go(client, '../OnUploadingScene')
      },

      community_scene_selected: function (client) {
          this.go(client, '../OnCommunityScene')
      },
    }
  }
})

module.exports = OnCompletedScene
