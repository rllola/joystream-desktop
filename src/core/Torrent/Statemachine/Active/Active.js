/**
 * Created by bedeho on 15/06/17.
 */

var BaseMachine = require('../../../BaseMachine')
var DownloadIncomplete = require('./DownloadIncomplete')
var FinishedDownloading = require('./FinishedDownloading')

import File from '../../../../utils/File'

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

              var file = new File(client.torrent, fileIndex, false)

              client.store.setIsPlaying(file)
            },
        },

        FinishedDownloading : {
            _child : FinishedDownloading,

            play: function (client, fileIndex) {

              var file = new File(client.torrent, fileIndex, true)

              client.store.setIsPlaying(file)
            },
        }
    }
})

module.exports = Active
