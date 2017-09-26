/**
 * Created by bedeho on 12/06/17.
 */

const BaseMachine = require('../../../../BaseMachine')
const Common = require('./../../Common')
import {remote} from 'electron'

var OnDownloadingScene = new BaseMachine({
  initialState: 'idle',
  states: {

    idle: {

      completed_scene_selected: function (client) {
        this.go(client, '../OnCompletedScene')
      },

      uploading_scene_selected: function (client) {
        this.go(client, '../OnUploadingScene')
      },

      startDownloadWithTorrentFileFromFilePicker: function (client) {
        // Allow user to pick a torrent file
        var filesPicked = remote.dialog.showOpenDialog({
            title : "Pick torrent file",
            filters: [
                {name: 'Torrent file', extensions: ['torrent']},
                {name: 'All Files', extensions: ['*']}
            ],
            properties: ['openFile']}
        )

        // If the user did no pick any files, then we are done
        if(!filesPicked || filesPicked.length == 0)
            return

        // Get torrent file name picked
        var torrentFile = filesPicked[0]


        let settings

        try {
          settings = Common.prepareTorrentParams(client, torrentFile)
        } catch (error) {
          this.transition(client, error)
          return
        }

        Common.addTorrent(client, settings)
      },

      startDownloadWithTorrentFileFromDragAndDrop: function (client, files) {
        // If the user did no pick any files, then we are done
        if(!files || files.length == 0)
            return

        // Get torrent file name picked
        var torrentFile = files[0]

        let settings

        try {
          settings = Common.prepareTorrentParams(client, torrentFile.path)
        } catch (error) {
          this.transition(client, error)
          return
        }

        Common.addTorrent(client, settings)

      },

    },

    TorrentFileWasInvalid : {

        acceptTorrentFileWasInvalid: function (client) {

            // Go back to idle
            this.transition(client, 'idle')
        }
    },

    TorrentAlreadyAdded : {

        acceptTorrentWasAlreadyAdded : function(client) {

            // Go back to idle
            this.transition(client, 'idle')
        }
    }
  }
})


module.exports = OnDownloadingScene
