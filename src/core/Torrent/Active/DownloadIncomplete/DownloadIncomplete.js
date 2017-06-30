/**
 * Created by bedeho on 13/06/17.
 */

import machina from 'machina'
import {go} from '../utils'

import Paid from './Paid'
import Unpaid from './Unpaid/Unpaid'

var Downloading = new machina.BehavioralFsm({

    initialize: function (options) {

        // Allocate sub machines
        options.states.Paid._child = new Paid({parent_machine : this})
        options.states.Unpaid._child = new Unpaid({parent_machine : this})
    },

    initialState: "Uninitialized",

    states: {

        Uninitialized : {
            
            GoToUnpaid : function (client) {
                this.transition(client, 'Unpaid')
            },
            
            GoToPaid : function (client) {
                this.transition(client, 'Paid')
            }
            
        },

        Paid : {
            _child : null
        },

        Unpaid : {
            _child : null
        }
    }

})

export default Downloading