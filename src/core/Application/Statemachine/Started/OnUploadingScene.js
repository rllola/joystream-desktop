/**
 * Created by bedeho on 12/06/17.
 */
const BaseMachine = require('../../BaseMachine')

var OnUploadingScene = new BaseMachine({
  initialState: 'idle',
  states: {
    idle: {
      downloading_scene_selected: function (client) {
        this.go(client, '../OnDownloadingScene')
      },
      completed_scene_selected: function (client) {
        this.go(client, '../OnCompletedScene')
      }
    }
  }
})

module.exports = OnUploadingScene
