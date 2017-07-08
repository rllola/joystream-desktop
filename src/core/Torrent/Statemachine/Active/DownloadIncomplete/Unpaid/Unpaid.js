/**
 * Created by bedeho on 13/06/17.
 */

var BaseMachine = require('../../../../../BaseMachine')
var Started = require('./Started')

var Unpaid = new BaseMachine({

    initialState: "Uninitialized",

    states: {

        Uninitialized : {},

        Started : {

            _child : Started,

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
                this.transition(client, 'StartingLibtorrentTorrent')
            }

        },

        StartingLibtorrentTorrent : {

            startedLibtorrentTorrent : function (client) {
                client.startExtension()
                this.transition(client, 'StartingExtension')
            }
        },

        StartingExtension : {

            startedExtension : function (client) {
                this.go(client, 'Started/CannotStartPaidDownload')
                //this.transition(client, 'Started')
            }
        }

    }
})

module.exports = Unpaid