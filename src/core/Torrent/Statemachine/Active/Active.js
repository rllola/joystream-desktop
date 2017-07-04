/**
 * Created by bedeho on 15/06/17.
 */

import machina from 'machina'
import {go} from '../utils'

import DownloadIncomplete from './DownloadIncomplete'
import FinishedDownloading from './FinishedDownloading'

var Active = machina.BehavioralFsm({

    initialize: function (options) {},

    initialState: "Uninitialized",

    states: {

        Uninitialized : {},

        DownloadIncomplete : {
            _child : DownloadIncomplete(),

            downloadFinished : function (client) {

                client.goToObserveMode()

                this.go(client, 'FinishedDownloading/GoingToPassive')
            }
        },

        FinishedDownloading : {
            _child : FinishedDownloading()
        }
    },

    go : go
})

export default Active