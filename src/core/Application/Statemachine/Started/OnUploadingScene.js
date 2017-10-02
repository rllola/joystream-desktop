/**
 * Created by bedeho on 12/06/17.
 */

const BaseMachine = require('../../../BaseMachine')
const Common = require('./../Common')
import path from 'path'
import {remote} from 'electron'

const TorrentInfo = require('joystream-node').TorrentInfo
import DeepInitialState from '../../../../core/Torrent/Statemachine/DeepInitialState'


var OnUploadingScene = new BaseMachine({
    initialState: 'idle',
    states: {
        idle: {
            downloading_scene_selected: function (client) {
                this.go(client, '../OnDownloadingScene')
            },
            completed_scene_selected: function (client) {
                this.go(client, '../OnCompletedScene')
            },

            startTorrentUploadFlow : function (client) {

                this.transition(client, 'UserSelectingTorrentFileOrRawContent')

                // quick hack to trigger new input
                this.handle(client, 'hasTorrentFile')
            },
            
            startTorrentUploadFlowWithTorrentFile : function (client, files) {

                if(files && files.length > 0)
                    useTorrentFile(this, client, files[0].path)
            }
        },

        // It may make more sense to create a composite state out of the start
        // uploading flow, e.g. to capture common events like exitStartUploadingFlow (if its truely common)

        UserSelectingTorrentFileOrRawContent : {

            hasTorrentFile : function(client) {

                // Allow user to pick a torrent file
                var filesPicked = Common.showNativeTorrentFilePickerDialog()

                // If the user did no pick any files, then we are done
                if(!filesPicked || filesPicked.length == 0) {
                    this.transition(client, 'idle')
                    return
                }

                useTorrentFile(this, client, filesPicked[0])
            },

            hasRawContent : function (client) {
                this.transition(client, 'ProvideTorrentFileMetadata')
            },

            // User discards flow
            exitStartUploadingFlow : function(client) {
                this.transition(client, 'idle')
            }

        },

        TorrentFileWasInvalid : {

            acceptTorrentFileWasInvalid: function (client) {
                this.transition(client, 'idle')
            },

            exitStartUploadingFlow : function(client) {
                this.transition(client, 'idle')
            }
        },

        TorrentAlreadyAdded : {

            acceptTorrentWasAlreadyAdded : function(client) {
                this.transition(client, 'idle')
            },

            exitStartUploadingFlow : function(client) {
                this.transition(client, 'idle')
            }
        },

        UserPickingSavePath : {

            chooseSavePathButtonClicked : function (client) {

                let folderPicked = remote.dialog.showOpenDialog({
                    title : "Pick folder with torrent data",
                    properties: ['openDirectory']}
                )

                if(!folderPicked || folderPicked.length == 0)  {
                    this.transition(client, 'idle')
                    return
                }

                startUpload(this, client, folderPicked[0])

            },

            useTorrentFilePathButtonClicked : function(client) {

                let torrentFilePath = path.dirname(client.startUploadingTorrentFile)

                startUpload(this, client, torrentFilePath)
            },

            exitStartUploadingFlow : function (client) {
                this.transition(client, 'idle')
            }

        },

        LoadingTorrentForUploading : {

            started : function(client) {
                this.transition(client, 'idle')
            },

            failedStartUploadDueToIncompleteDownload : function(client) {

                // Expose torrent store for torrent that has failed
                let torrentStore = client.torrentBeingStartedForUploading._client.store

                client.store.setTorrentWithBadSavePathDuringStartUploadFlow(torrentStore)

                this.transition(client, 'TellUserAboutIncompleteDownload')
            }

        },

        TellUserAboutIncompleteDownload : {

            keepDownloadingClicked :  function(client) {

                this.transition(client, 'idle')

                // Go to downloading scene
                this.go(client, '../OnDownloadingScene')
            },

            dropDownloadClicked : function(client) {

                const infoHash = client.torrentBeingStartedForUploading._client.infoHash
                const deleteData = true

                Common.removeTorrent(client, infoHash, deleteData)

                this.transition(client, 'idle')
            },

            exitStartUploadingFlow : function (client) {
                this.transition(client, 'idle')
            }
        },

        ProvideTorrentFileMetadata : {

            generateTorrentFile : function (client) {

            },

            exitStartUploadingFlow : function (client) {
                this.transition(client, 'idle')
            }
        },

        GeneratingTorrentFile : {

            finishedGeneratingTorrentFile : function (client) {

            },

            exitStartUploadingFlow : function (client) {
                this.transition(client, 'idle')
            }

        },

    }
})

function useTorrentFile(machine, client, torrentFile) {

    // Get torrent file name picked
    let torrentInfo

    try {
        torrentInfo = new TorrentInfo(torrentFile)
    } catch(e) {
        machine.transition(client, 'TorrentFileWasInvalid')
        return
    }

    // Temporary state
    client.torrentInfoToBeUploaded = torrentInfo

    // Make sure torrent is not already added
    if(client.torrents.has(torrentInfo.infoHash())) {
        machine.transition(client, 'TorrentAlreadyAdded')
        return
    }

    // Remember location of the torrent file
    client.startUploadingTorrentFile = torrentFile

    // Update store
    client.store.setStartUploadingTorrentFile(torrentFile)

    machine.transition(client, 'UserPickingSavePath')

}

function startUpload(machine, client, torrentFile) {

    // Get new settings
    let settings = Common.getStartingUploadSettings(client.torrentInfoToBeUploaded, torrentFile)

    // and start adding torrent
    let torrentStm = Common.addTorrent(client, settings)

    // -----

    // When loading either succeeds, or fails due to no complete download,
    // we detect this and process event
    torrentStm.once('loaded', (deepInitialState) => {

        if(deepInitialState === DeepInitialState.UPLOADING.STARTED)
            client.processStateMachineInput('started', torrentStm)
        else
            client.processStateMachineInput('failedStartUploadDueToIncompleteDownload', torrentStm)

    })

    // Remember torrent in question
    client.torrentBeingStartedForUploading = torrentStm

    machine.transition(client, 'LoadingTorrentForUploading')
}

module.exports = OnUploadingScene
