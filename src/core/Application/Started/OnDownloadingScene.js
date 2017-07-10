/**
 * Created by bedeho on 12/06/17.
 */

const BaseMachine = require('../../BaseMachine')

var OnDownloadingScene = new BaseMachine({
  states: {
    uninitialized: {
      _onEnter: function (client) {
        client.uiShowDownloadingScene()
      },
      showing_downloading_scene: function (client) {
        client.uiResetDownloadingNotificationCounter()
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
      goto_completed_scene: function (client) {
        this.go(client, '../OnCompletedScene')
      },
      goto_uploading_scene: function (client) {
        this.go(client, '../OnUploadingScene')
      },
      _reset: 'uninitialized'
    },
    selecting_file_dialog_modal: {
      _onEnter: function (client) {
        client.uiShowFilePicker()
      },
      file_selected: function (client, file) {
        client._state.fileSelected = file
        this.transition(client, 'checking_torrent_file')
      },
      file_selection_canceled: function (client) {
        this.transition(client, 'idle')
      }
    },
    checking_torrent_file: {
      _onEnter: function (client) {
        client.uiShowFileCheckingDialog(client._state.fileSelected)
      },
      file_invalid: function (client) {
        this.transition(client, 'idle')
      },
      file_accepted: function (client, torrent) {
        client._state.torrentToAdd = torrent
        this.transition(client, 'loading_torrent_dialog_modal')
      },
      _onExit: function (client) {
        client._state.fileSelected = null
        client.uiCloseFileCheckingDialogue()
      }
    },
    loading_torrent_dialog_modal: {
      _onEnter: function (client) {
        client.uiShowLoadingTorrentDialog(client._state.torrentToAdd)
      },
      torrent_available: function (client) {
        this.go(client, '../OnCompletedScene')
      },
      _onExit: function (client) {
        client.closeLoadingTorrentDialog()
      },
      _reset: 'uninitialized'
    }
  }
})

module.exports = OnDownloadingScene
