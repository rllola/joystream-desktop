/**
 * Created by bedeho on 13/06/17.
 */

import machina from 'machina'
import {go} from '../utils'

import Paid from './Paid'
import Unpaid from './Unpaid/Unpaid'

var Downloading = machina.BehavioralFsm({

    initialize: function (options) {
    },

    initialState: "Uninitialized",

    states: {

        Uninitialized : {
            
            goToUnpaid : function (client) {
                this.transition(client, 'Unpaid')
            },
            
            goToPaid : function (client) {
                this.transition(client, 'Paid')
            }
            
        },

        Paid : {
            _child : Paid()
        },

        Unpaid : {
            _child : Unpaid()
        }
    }

})

export default Downloading