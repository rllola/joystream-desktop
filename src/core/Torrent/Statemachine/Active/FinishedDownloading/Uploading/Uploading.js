/**
 * Created by bedeho on 26/06/17.
 */

var BaseMachine = require('../../../../../BaseMachine')
var refreshPeers = require('../../../utils').refreshPeers

var Uploading = new BaseMachine({

    initialState: "Uninitialized",

    states: {

        Uninitialized : {},

        Started: {

            stop : function (client) {

                client.stopExtension()
                this.transition(client, 'StoppingExtension')
            },

            updateSellerTerms : function(client, sellerTerms) {

                // Hold on to these terms temporary
                client._newSellerTerms = sellerTerms

                // Tell user to change seller terms
                client.updateSellerTerms(sellerTerms)

                this.transition(client, 'ChangingSellerTerms')
            },

            processPeerPluginStatuses: function (client, statuses) {

                // Normal peer list refresh
                refreshPeers(client, statuses)

                // Try to start uploading on all peers
                for(var pid in client.peers) {

                    client.peers[pid].startUploading(client._sellerTerms)
                }

            },

            startUploadingResult : function (client, pid, err) {

                var peer = client.peers[pid]

                if(peer)
                    peer.startedUploadingResult(err)

            },

            goToPassive : function(client) {

                client.goToObserveMode()
                this.transition(client, 'GoingToObserveMode')
            }
        },

        StoppingExtension : {

            stoppedExtension : function (client) {

                client.stopLibtorrentTorrent()
                this.transition(client, 'StoppingLibtorrentTorrent')
            }
        },

        StoppingLibtorrentTorrent: {

            stoppedLibtorrentTorrent : function (client) {

                this.transition(client, 'Stopped')
            }
        },

        ChangingSellerTerms : {

            updateSellerTermsResult: function (client) {

                // Keep new terms
                client._sellerTerms = client._newSellerTerms

                // Drop temporary terms storage
                delete client._newSellerTerms

                this.transition(client, 'Started')
            }

        },

        Stopped: {

            start: function (client) {

                client.startLibtorrentTorrent()
                this.transition(client, 'StartingLibtorrentTorrent')
            },

            goToPassive: function (client) {

                client.startExtension()
                this.transition(client, 'StartingExtensionForPassiveMode')
            }

        },

        StartingExtensionForPassiveMode: {

            startedExtensionResult: function (client, err) {

                client.goToObserveMode()
                this.transition(client, 'GoingToObserveMode')
            }
        },

        GoingToObserveMode : {

            startedObserveMode: function (client) {
                this.transition(client, 'Passive')
            }
        },

        StartingLibtorrentTorrent: {

            startedLibtorrentTorrent: function (client) {
                client.startExtension()
                this.transition(client, 'StartingExtension')
            }
        },

        StartingExtension: {
            startedExtensionResult: function (client) {
                this.transition(client, 'Started')
            }
        }
    }

})

module.exports = Uploading