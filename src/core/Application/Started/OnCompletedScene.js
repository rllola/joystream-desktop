/**
 * Created by bedeho on 12/06/17.
 */
const BaseMachine = require('../../BaseMachine')

var OnCompletedScene = new BaseMachine({
  states: {
    uninitialized: {
      showing_scene: function (client) {
        client.resetCompletedNotificationCounter()
        this.transition(client, 'idle')
      }
    },
    idle: {
      downloading_scene_selected: function (client) {
        this.go(client, '../OnDownloadingScene')
      },
      uploading_scene_selected: function (client) {
        this.go(client, '../OnUploadingScene')
      },
      _reset: 'uninitialized'
    }
  }
})

module.exports = OnCompletedScene
