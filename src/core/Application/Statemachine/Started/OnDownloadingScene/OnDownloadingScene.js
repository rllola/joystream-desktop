/**
 * Created by bedeho on 12/06/17.
 */

const BaseMachine = require('../../../../BaseMachine')
const Common = require('./../../Common')

const TorrentInfo = require('joystream-node').TorrentInfo

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
        var filesPicked = Common.showNativeTorrentFilePickerDialog()

        // If the user did no pick any files, then we are done
        if(!filesPicked || filesPicked.length == 0)
            return

        startDownload(this, client, filesPicked[0])

      },

      startDownloadWithTorrentFileFromDragAndDrop: function (client, files) {

        // If the user did no pick any files, then we are done
        if(!files || files.length == 0)
            return

        // Try to start download based on torrent file name
        startDownload(this, client, files[0])

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
            // HACK
            this.handle(client, 'startDownloadWithTorrentFileFromFilePicker')

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

function startDownload(machine, client, torrentFile) {

    // Get torrent file name picked
    let torrentInfo

    try {
        torrentInfo = new TorrentInfo(torrentFile)
    } catch(e) {
        machine.transition(client, 'TorrentFileWasInvalid')
        return
    }

    // Make sure torrent is not already added
    if(client.torrents.has(torrentInfo.infoHash())) {
        machine.transition(client, 'TorrentAlreadyAdded')
        return
    }

    // otherwise, get new settings
    let settings = Common.getStartingDownloadSettings(torrentInfo, client.directories.defaultSavePath())

    // and start adding torrent
    Common.addTorrent(client, settings)

}


module.exports = OnDownloadingScene
