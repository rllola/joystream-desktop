/**
 * Created by bedeho on 15/06/17.
 */

var machina = require('machina')

var DownloadIncomplete = require('./DownloadIncomplete')
var FinishedDownloading = require('./FinishedDownloading')

var Active = new machina.BehavioralFsm({

    initialState: "Uninitialized",

    states: {

        Uninitialized : {},

        DownloadIncomplete : {
            _child : DownloadIncomplete,

            downloadFinished : function (client) {

                client.goToObserveMode()

                this.go(client, 'FinishedDownloading/GoingToPassive')
            }
        },

        FinishedDownloading : {
            _child : FinishedDownloading
        }
    }
})

module.exports.Active = Active