/**
 * Created by bedeho on 12/06/17.
 */

const BaseMachine = require('../../../BaseMachine')

var OnDownloadingScene = new BaseMachine({
  initialState: 'idle',
  states: {
    idle: {
      completed_scene_selected: function (client) {
        this.go(client, '../OnCompletedScene')
      },
      uploading_scene_selected: function (client) {
        this.go(client, '../OnUploadingScene')
      }
    }
  }
})

module.exports = OnDownloadingScene
