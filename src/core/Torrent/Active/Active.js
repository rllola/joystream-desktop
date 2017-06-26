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
        options.states.DownloadIncomplete._child = new DownloadIncomplete({parent_machine : this})
        options.states.FinishedDownloading._child = new FinishedDownloading({parent_machine : this})
    },

    initialState: "Uninitialized",

    states: {

        Uninitialized : {},

        DownloadIncomplete : {
            _child : null,

            DownloadFinished : function (client) {

                client.goToObserveMode()
                this.transition(client, 'GoingToObserveMode')
            }
        },

        GoingToObserveMode : {

            StartedObserveMode : function(client) {
                //this.transition(client, 'FinishedDownloading')
                this.go(client, ['FinishedDownloading','Passive'])
                // how to make FinishedDownloading enter its passive state??
            }

        },

        FinishedDownloading : {
            _child : null
        }
    },

    go : go
})

export default Active