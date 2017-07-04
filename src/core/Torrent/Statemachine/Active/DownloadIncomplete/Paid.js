/**
 * Created by bedeho on 13/06/17.
 */

import machina from 'machina'
import {go} from '../utils'

var Paid = machina.BehavioralFsm({

    initialize: function (options) {
    },

    initialState: "Uninitialized",

    states: {

        Uninitialized : {

            start : function (client) {

            },

            stop : function (client) {

            }

        },

        Started : {


            // Future hook for when all paid peers left _before_
            // we completed the download
            // NB: Doing anything here may require complementary
            // changes in protocol_session/extension.
            lastSellerLeft : function(client) {
                // add later!!
            },

            stop: function(client) {
                client.stopExtension()
                this.transition(client, 'StoppingExtension')
            }

        },

        StoppingExtension : {

            stoppedExtension: function (client) {
                client.stopLibtorrentTorrent()
                this.transition(client, 'StoppingLibtorrentTorrent')
            }

        },

        StoppingLibtorrentTorrent : {

            stoppedLibtorrentTorrent : function (client) {
                this.transition(client, 'Stopped')
            }

        },

        Stopped : {

            start : function (client) {
                client.startLibtorrentTorrent()
                this.transition(client, 'StartingLibtorrentTorrent')
            }

        },

        StartingLibtorrentTorrent : {

            startedLibtorrentTorrent: function (client) {
                client.startExtension()
                this.transition(client, 'StartingExtension')
            }
        },

        StartingExtension : {
            startedExtension : function(client) {
                this.transition(client, 'Started')
            }
        }

    },

    go : go

})

export default Paid