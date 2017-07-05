/**
 * Created by bedeho on 13/06/17.
 */

var machina = require('machina')

var Paid = require('./Paid')
var Unpaid = require('./Unpaid/Unpaid')

var Downloading = new machina.BehavioralFsm({

    initialState: "Uninitialized",

    states: {

        Uninitialized : {},
        Paid : {
            _child : Paid
        },

        Unpaid : {
            _child : Unpaid
        }
    }

})

module.exports.Downloading = Downloading