/**
 * Created by bedeho on 15/06/17.
 */

import machina from 'machina'
import {go} from '../utils'

import DownloadIncomplete from './DownloadIncomplete'
import FinishedDownloading from './FinishedDownloading'

var Active = new machina.BehavioralFsm({

    initialize: function (options) {

        // Allocate sub machines
        options.states.DownloadIncomplete._child = new Downloading({parent_machine : this})
        options.states.FinishedDownloading._child = new FinishedDownloading({parent_machine : this})
    },

    //initialState: "StoppingExtension",

    states: {

        DownloadIncomplete : {
            _child : null,

            DownloadFinished : function (client) {

                client.stopLibtorrentTorrent()
                this.transition(client, 'GoingToPassive')
            }
        },

        StoppingLibTorrentTorrent : {

        },





        FinishedDownloading : {
            _child : null
        }
    },

    go : go
}

export default Active