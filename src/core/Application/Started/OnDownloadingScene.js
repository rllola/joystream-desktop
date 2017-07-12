/**
 * Created by bedeho on 12/06/17.
 */

const BaseMachine = require('../../BaseMachine')

var OnDownloadingScene = new BaseMachine({
  states: {
    uninitialized: {
      showing_scene: function (client) {
        client.resetDownloadingNotificationCounter()
        this.transition(client, 'idle')
      }
    },
    idle: {
      // use file picker to add a torrent and start downloading
      select_file: function (client) {
        this.transition(client, 'selecting_file_dialog_modal')
      },
      // file dropped
      file_dropped: function (client, file) {
        client._state.fileSelected = file
        this.transition(client, 'checking_torrent_file')
      },
      completed_scene_selected: function (client) {
        this.go(client, '../OnCompletedScene')
      },
      uploading_scene_selected: function (client) {
        this.go(client, '../OnUploadingScene')
      },
      _reset: 'uninitialized'
    },
    selecting_file_dialog_modal: {
      file_selected: function (client, file) {
        client._state.fileSelected = file
        this.transition(client, 'checking_torrent_file')
      },
      file_selection_canceled: function (client) {
        this.transition(client, 'idle')
      }
    },
    checking_torrent_file: {
      file_invalid: function (client) {
        this.transition(client, 'idle')
      },
      file_accepted: function (client, torrent) {
        client._state.torrentToAdd = torrent
        this.transition(client, 'loading_torrent_dialog_modal')
      }
    },
    loading_torrent_dialog_modal: {
      torrent_available: function (client) {
        this.go(client, '../OnCompletedScene')
      },
      torrent_loaded: function (client) {
        this.transition(client, 'idle')
      },
      _reset: 'uninitialized'
    }
  }
})

module.exports = OnDownloadingScene
