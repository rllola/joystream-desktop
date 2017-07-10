/**
 * Created by bedeho on 12/06/17.
 */

import BaseMachine from '../../BaseMachine'

var OnUploadingScense = new BaseMachine({
  states: {
    uninitialized: {
      _onEnter: function (client) {
        client.uiShowUploadingScene()
      },
      showing_scene: function (client) {
        client.uiResetUploadingNotificationCounter()
        this.transition(client, 'idle')
      }
    },
    idle: {
      goto_downloading_scene: function (client) {
        this.go(client, '../OnDownloadingScene')
      },
      goto_completed_scene: function (client) {
        this.go(client, '../OnCompletedScene')
      },
      _reset: 'uninitialized'
    }
  }
})

export default OnUploadingScense
