/**
 * Created by bedeho on 12/06/17.
 */
const BaseMachine = require('../../BaseMachine')

var OnCompletedScene = new BaseMachine({
  states: {
    uninitialized: {
      _onEnter: function (client) {
        client.uiShowCompletedScene()
      },
      showing_scene: function (client) {
        client.uiResetCompletedNotificationCounter()
        this.transition(client, 'idle')
      }
    },
    idle: {
      goto_downloading_scene: function (client) {
        this.go(client, '../OnDownloadingScene')
      },
      goto_uploading_scene: function (client) {
        this.go(client, '../OnUploadingScene')
      },
      _reset: 'uninitialized'
    }
  }
})

module.exports = OnCompletedScene
