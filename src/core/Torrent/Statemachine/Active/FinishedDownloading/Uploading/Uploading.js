/**
 * Created by bedeho on 26/06/17.
 */

var BaseMachine = require('../../../../../BaseMachine')
var refreshPeers = require('../../../../../utils').refreshPeers

var Uploading = new BaseMachine({

    initialState: "Uninitialized",

    states: {

        Uninitialized : {},

        Started: {

            stop : function (client) {
                client.stopExtension()
                this.transition(client, 'StoppingExtension')
            },

            changeSellerTerms : function(client, sellerTerms) {

                // Hold on to these terms temporary
                client._newSellerTerms = sellerTerms

                // Tell user to change seller terms
                client.changeSellerTerms(sellerTerms)

                this.transition(client, 'ChangingSellerTerms')
            },

            processPeerPluginStatuses: function (client, statuses) {

                // Normal peer list refresh
                refreshPeers(client, statuses)

                // Try to start uploading on all peers
                var peerIds = client.allPeerIds()

                for(var i in peerIds) {

                    var peerId = peerIds[i]

                    client.startUploading(peerId, client._sellerTerms)
                }

            },

            startUploadingFailed : function (client, peerId, err) {

                var peer = client.getPeer(peerId)

                if(peer)
                    peer.failedToStartUploading(err)
            },

            startedPaidUploading: function (client, peerId) {

                var peer = client.getPeer(peerId)

                if(peer)
                    peer.startUploading()
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

            changedSellerTerms: function (client) {

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
            startedExtension: function (client) {
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
                client.startedExtension()
                this.transition(client, 'StartingExtension')
            }
        },

        StartingExtension: {
            startedExtension: function (client) {
                this.transition(client, 'Started')
            }
        }
    }

})

module.exports = Uploading