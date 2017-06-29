/**
 * Created by bedeho on 13/06/17.
 */

import machina from 'machina'
import {go} from '../utils'

var Unpaid = new machina.BehavioralFsm({

    initialize: function (options) {
        options.states.Started._child = new Started({parent_machine : this})
    },

    initialState: "Uninitialized",

    states: {

        Uninitialized : {

            GoToStarted : function (client) {
                this.transition(client, 'Started')
            },

            GoToStopped : function (client) {
                this.transition(client, 'Stopped')
            }

        },

        Started : {

            _child : null,

            Stop : function(client) {
                client.stopExtension()
                this.transition(client, 'StoppingExtension')
            },
            
            ChangeBuyerTerms : function (client, buyerTerms) {

                // Store new buyer terms temporarily
                client._newBuyerTerms = buyerTerms
                this.transition(client, 'ChangingBuyerTerms')
            }
        },

        StoppingExtension: {

            StoppedExtension: function(client) {
                client.stopLibTorrentTorrent()
                this.transition(client, 'StoppingTorrent')
            }
        },

        StoppingLibtorrentTorrent: {

            StoppedLibtorrentTorrent : function(client) {
                this.transition(client, 'Started')
            }

        },

        ChangingBuyerTerms : {

            BuyerTermsChanged : function (client) {

                // Hold on to new terms
                client._buyerTerms = client._newBuyerTerms

                // Delete temporary new terms storage
                delete client._newBuyerTerms

                this.transition(client, 'Started')
            }

        },

        Stopped : {

            Start : function (client) {
                client.startLibtorrentTorrent()
                this.transition('StartingLibtorrentTorrent')
            }

        },

        StartingLibtorrentTorrent : {

            Started : function (client) {
                client.startExtension()
                this.transition(client, 'StartingExtension')
            }
        },

        StartingExtension : {

            Started : function (client) {
                this.transition(client, 'Started')
            }
        }

    },

    go : go

})


var Started = new machina.BehavioralFsm({

    initialize: function (options) {
    },

    initialState: "Uninitialized",

    states: {

        Uninitialized: {},

        CanStartPaidDownload : {

            PeerPluginsStatuses: function(client, statuses) {
                // if its no longer possible

                this.transition(client, 'CannotStartPaidDownload')

            },

            StartPaidDownload : function (client, params) {

                // Notify user to attempts a paid download with given parameters
                client.initiatePaidDownload(params)

                this.transition(client, 'InitiatingPaidDownload')
            }

        },

        InitiatingPaidDownload : {

            PaidDownloadInitiationCompleted : function (client, res, err) {

                if (err) {

                    // Tell user about failure
                    client.paidDownloadInitiationFailed()

                    // Go back to initation state
                    this.transition(client, 'CanStartPaidDownload')

                } else {

                    this.go(client, ['..', '..', 'Paid', 'Started'])

                    // Go back to started
                    this.transition(client, 'Started')
                }

            }
        },

        CannotStartPaidDownload : {

            PeerPluginsStatuses: function(client, statuses) {
                // if it is now longer possible

                this.transition(client, 'CanStartPaidDownload')
            }

        }

    }

})

export default Unpaid