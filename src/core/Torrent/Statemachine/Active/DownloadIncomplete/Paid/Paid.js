/**
 * Created by bedeho on 13/06/17.
 */

var BaseMachine = require('../../../../../BaseMachine')

var Paid = new BaseMachine({

    initialState: "Uninitialized",

    states: {

        Uninitialized : {},

        Started : {

            // Future hook for when all paid peers left _before_
            // we completed the download
            // NB: Doing anything here may require complementary
            // changes in protocol_session/extension.
            lastSellerLeft : function(client) {
                // add later!!
            },

            /**
            stop: function(client) {
                client.stopExtension()
                client.stopLibtorrentTorrent()
                this.transition(client, 'Stopped')
            }
            */

        },

        /**
        Stopped : {

            start : function (client) {
                client.startLibtorrentTorrent()
                client.startExtension()
                this.transition(client, 'Started')
            }

        }
        */
    }
})

module.exports = Paid
