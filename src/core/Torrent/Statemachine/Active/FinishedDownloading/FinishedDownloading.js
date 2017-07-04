/**
 * Created by bedeho on 13/06/17.
 */

import machina from 'machina'
import {go} from '../utils'

import Uploading from './Uploading'

var Active = machina.BehavioralFsm({

    initialize: function (options) {},

    initialState: "Uninitialized",

    states: {

        Uninitialized : {},

        GoingToPassive : {

            startedObserveMode : function(client) {

                this.transition(client, 'Passive')
            }

        },

        Passive : {
            
            startPaidUploading : function (client, sellerTerms) {

                client.goToSellMode(sellerTerms)

                this.transition(client, 'GoingToSellMode')
            }
            
        },

        GoingToSellMode : {
            
            startedSellMode : function (client) {
                this.transition(client, 'Uploading')
            }
        },

        Uploading : {
            _child : Uploading()
        }

    },

    go : go
})

export default Active