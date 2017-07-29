/**
 * Created by bedeho on 26/06/17.
 */

var BaseMachine = require('../../../../../BaseMachine')

var Uploading = new BaseMachine({

    initialState: "Uninitialized",

    states: {

        Uninitialized : {},

        Started: {

            stop: function (client) {

                client.stopExtension()
                client.stopLibtorrentTorrent()
                this.transition(client, 'Stopped')
            },

            updateSellerTerms: function(client, sellerTerms) {

                // Keep new terms
                client.sellerTerms = sellerTerms

                // Tell user to change seller terms
                client.updateSellerTerms(sellerTerms)
            },

            goToPassive: function(client) {

                client.toObserveMode()

                this.go(client, '../Passive')
            }
        },

        Stopped: {

            start: function (client) {

                client.startLibtorrentTorrent()
                client.startExtension()

                this.transition(client, 'Started')
            },

            goToPassive: function (client) {

                client.startLibtorrentTorrent()
                client.startExtension()
                client.toObserveMode()

                this.go(client, '../Passive')
            }
        }
    }

})

module.exports = Uploading
