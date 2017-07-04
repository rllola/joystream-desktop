/**
 * Created by bedeho on 13/06/17.
 */

import machina from 'machina'
import {go, refreshPeers} from '../../../../utils'

import Started from './Started'

var Unpaid = machina.BehavioralFsm({

    initialize: function (options) {
    },

    initialState: "Uninitialized",

    states: {

        Uninitialized : {

            goToStarted : function (client) {
                this.transition(client, 'Started')
            },

            goToStopped : function (client) {
                this.transition(client, 'Stopped')
            }

        },

        Started : {

            _child : Started(),

            stop : function(client) {
                client.stopExtension()
                this.transition(client, 'StoppingExtension')
            },
            
            changeBuyerTerms : function (client, buyerTerms) {

                // Store new buyer terms temporarily
                client._newBuyerTerms = buyerTerms
                this.transition(client, 'ChangingBuyerTerms')
            }
        },

        StoppingExtension: {

            stoppedExtension: function(client) {
                client.stopLibTorrentTorrent()
                this.transition(client, 'StoppingTorrent')
            }
        },

        StoppingLibtorrentTorrent: {

            stoppedLibtorrentTorrent : function(client) {
                this.transition(client, 'Started')
            }

        },

        ChangingBuyerTerms : {

            buyerTermsChanged : function (client) {

                // Hold on to new terms
                client._buyerTerms = client._newBuyerTerms

                // Delete temporary new terms storage
                delete client._newBuyerTerms

                this.transition(client, 'Started')
            }

        },

        Stopped : {

            start : function (client) {
                client.startLibtorrentTorrent()
                this.transition('StartingLibtorrentTorrent')
            }

        },

        StartingLibtorrentTorrent : {

            started : function (client) {
                client.startExtension()
                this.transition(client, 'StartingExtension')
            }
        },

        StartingExtension : {

            started : function (client) {
                this.transition(client, 'Started')
            }
        }

    },

    go : go

})

export default Unpaid