/**
 * Created by bedeho on 13/06/17.
 */

import machina from 'machina'

var Torrent = new machina.BehavioralFsm({

    initialize: function (options) {
        // your setup code goes here...
    },

    namespace: "vehicle-signal",

    initialState: "uninitialized",

    states: {

        uninitialized : {

            start: function (client) {

            }
        },

        Load : {

        },


        Loading : {

        },

        Active : {

            _child : null

        },

        Terminating : {

        }


    }

})

export default Torrent