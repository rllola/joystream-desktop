/**
 * Created by bedeho on 12/06/17.
 */

const BaseMachine = require('../../../../BaseMachine')
const Common = require('./../../Common')


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

          try {
              Common.startDownloadWithTorrentFileFromFilePicker(client)
          } catch (error) {
              this.transition(client, error)
              return
          }
      },

      startDownloadWithTorrentFileFromDragAndDrop: function (client, files) {
        // If the user did no pick any files, then we are done
        if(!files || files.length == 0)
            return

        // Get torrent file name picked
        var torrentFile = files[0]

        let settings

        try {
          settings = Common.prepareTorrentParams(client, torrentFile)
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
        },

        retryPickingTorrentFile : function (client) {

            this.transition(client, 'idle')

            // Try to start download again
            try {
                Common.startDownloadWithTorrentFileFromFilePicker(client)
            } catch (error) {
                this.transition(client, error)
                return
            }

        }
    },

    TorrentAlreadyAdded : {

        acceptTorrentFileWasAlreadyAdded : function(client) {

            // Go back to idle
            this.transition(client, 'idle')
        }
    }
  }
})


module.exports = OnDownloadingScene
