/**
 * Created by bedeho on 13/06/17.
 */

import machina from 'machina'
import {go} from '../utils'

import Downloading from './DownloadIncomplete'
import FinishedDownloading from './FinishedDownloading'

var Active = new machina.BehavioralFsm({

    initialize: function (options) {

        // Allocate sub machines
        options.states.Uploading._child =
    },

    initialState: "Uninitialized",

    states: {

        Uninitialized : {},

        Passive : {
            
            StartPaidUploading : function (client, sellerTerms) {

                client.goToSellMode(sellerTerms)
                this.transition(client, 'GoingToSellMode')
            }
            
        },

        GoingToSellMode : {
            
            StartedSellMode : function (client) {
                this.transition(client, '')
            }
        },

        Uploading : {
            _child : null
        }


    },

    go : go
}

export default Active