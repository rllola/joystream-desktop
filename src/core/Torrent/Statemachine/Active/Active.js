/**
 * Created by bedeho on 15/06/17.
 */

var BaseMachine = require('../../../BaseMachine')
var DownloadIncomplete = require('./DownloadIncomplete')
var FinishedDownloading = require('./FinishedDownloading')
var Common = require('../Common')
var Doorbell = require('../../../Doorbell')

var File = require('../../../../utils/File').default
var MediaPlayerStore = require('../../../MediaPlayerStore')

import StreamServer from '../../../../utils/StreamServer'

var Active = new BaseMachine({

    initialState: "Uninitialized",

    states: {

        Uninitialized : {},

        DownloadIncomplete : {
            _child : DownloadIncomplete,

            downloadFinished : function (client) {

                client.toObserveMode()

                this.go(client, 'FinishedDownloading/Passive')
            },

            play: function (client, fileIndex) {

                startMediaPlayer(client, fileIndex, false)
            },
        },

        FinishedDownloading : {
            _child : FinishedDownloading,

            play: function (client, fileIndex) {

                startMediaPlayer(client, fileIndex, true)
            },
        }
    }
})

function startMediaPlayer(client, fileIndex, completed) {

    var file = new File(client.torrent, fileIndex, completed)

    // Hide feedback in player
    Doorbell.hide()

    console.log('startMediaPlayer')

    // Create store for player
    let mediaSourceType = completed ? MediaPlayerStore.MEDIA_SOURCE_TYPE.DISK : MediaPlayerStore.MEDIA_SOURCE_TYPE.STREAMING_TORRENT
    const loadedSecondsRequiredForPlayback = 10
    let autoPlay = true

    console.log(file)
    var streamServer = new StreamServer(file)
    streamServer.start()

    /*let store = new MediaPlayerStore(mediaSourceType,
                                    client.store,
                                    file,
                                    loadedSecondsRequiredForPlayback,
                                    autoPlay,
                                    mediaPlayerWindowSizeFetcher,
                                    mediaPlayerWindowSizeUpdater,
                                    powerSavingBlocker,
                                    showDoorbellWidget)


    // and set on torrent store
    client.store.setActiveMediaPlayerStore(store)*/
}

var electron = require('electron')

function mediaPlayerWindowSizeFetcher() {
    return { width : window.innerWidth, height : window.innerHeight}
}

function mediaPlayerWindowSizeUpdater(bounds) {
    electron.ipcRenderer.send('set-bounds', bounds)
}

function powerSavingBlocker(enable) {
    electron.ipcRenderer.send('power-save-blocker', {enable: enable})
}

function showDoorbellWidget() {
    Doorbell.show()
}

module.exports = Active
