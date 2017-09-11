/**
 * Created by bedeho on 12/06/17.
 */

const BaseMachine = require('../../../../BaseMachine')
const TorrentStatemachine = require('../../../../Torrent/Statemachine')
const TorrentInfo = require('joystream-node').TorrentInfo
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


        client.processStateMachineInput('startDownload', torrentFile)
      },

      startDownloadWithTorrentFileFromDragAndDrop: function (client, files) {
        // If the user did no pick any files, then we are done
        if(!files || files.length == 0)
            return

        // Get torrent file name picked
        var torrentFile = files[0]

        client.processStateMachineInput('startDownload', torrentFile.path)
      },

      startDownload: function(client, filePath) {

          // Load torrent file
          let torrentInfo

          try {
              torrentInfo = new TorrentInfo(filePath)
          } catch(e) {

              console.log(e)

              // <Set error_code on store also perhaps?>

              this.transition(client, 'TorrentFileWasInvalid')
              return
          }

          const infoHash = torrentInfo.infoHash()

          // Make sure torrent is not already added
          if(client.torrents.has(infoHash)) {

              this.transition(client, 'TorrentAlreadyAdded')
              return
          }

          // NB: Get from settings data store of some sort
          let terms = Common.getStandardbuyerTerms()

          // Create settings
          let settings = {
              infoHash : infoHash,
              metadata : torrentInfo,
              resumeData : null,
              name: torrentInfo.name() || infoHash,
              savePath: client.directories.defaultSavePath(),
              deepInitialState: TorrentStatemachine.DeepInitialState.DOWNLOADING.UNPAID.STARTED,
              extensionSettings : {
                  buyerTerms: terms
              }
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
