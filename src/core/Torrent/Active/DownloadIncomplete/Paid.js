/**
 * Created by bedeho on 13/06/17.
 */

import machina from 'machina'
import {go} from '../utils'

var Paid = new machina.BehavioralFsm({

    initialize: function (options) {
    },

    initialState: "Uninitialized",

    states: {

        Uninitialized : {

            Start : function (client) {

            },

            Stop : function (client) {

            }

        },

        Started : {


            // Future hook for when all paid peers left _before_
            // we completed the download
            // NB: Doing anything here may require complementary
            // changes in protocol_session/extension.
            LastSellerLeft : function(client) {
                // add later!!
            },

            Stop: function(client) {
                client.stopExtension()
                this.transition(client, 'StoppingExtension')
            }

        },

        StoppingExtension : {

            StoppedExtension: function (client) {
                client.stopLibtorrentTorrent()
                this.transition(client, 'StoppingLibtorrentTorrent')
            }

        },

        StoppingLibtorrentTorrent : {

            StoppedLibtorrentTorrent : function (client) {
                this.transition(client, 'Stopped')
            }

        },

        Stopped : {

            Start : function (client) {
                client.startLibtorrentTorrent()
                this.transition(client, 'StartingLibtorrentTorrent')
            }

        },

        StartingLibtorrentTorrent : {

            StartedLibtorrentTorrent: function (client) {
                client.startExtension()
                this.transition(client, 'StartingExtension')
            }
        },

        StartingExtension : {
            StartedExtension : function(client) {
                this.transition(client, 'Started')
            }
        }

    },

    go : go

})

export default Paid