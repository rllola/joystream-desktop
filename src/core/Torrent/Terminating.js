/**
 * Created by bedeho on 13/06/17.
 */

import machina from 'machina'

var Terminating = new machina.BehavioralFsm({

    initialize: function (options) {
        // your setup code goes here...
    },

    namespace: "vehicle-signal",

    initialState: "uninitialized",

    states: {



    }

})

export default Terminating