/**
 * Created by bedeho on 26/06/17.
 */

import machina from 'machina'
import {go, refreshPeers} from '../utils'

var Uploading = new machina.BehavioralFsm({

    initialState: "Uninitialized",

    states: {

        Uninitialized : {},

        Started: {

            Stop : function (client) {
                client.stopExtension()
                this.transition(client, 'StoppingExtension')
            },

            ChangeSellerTerms : function(client, sellerTerms) {

                // Hold on to these terms temporary
                client._newSellerTerms = sellerTerms

                // Tell user to change seller terms
                client.changeSellerTerms(sellerTerms)

                this.transition(client, 'ChangingSellerTerms')
            },

            ProcessPeerPluginStatuses: function (client, statuses) {

                // Normal peer list refresh
                refreshPeers(client, statuses)

                // Try to start uploading on all peers
                var peerIds = client.allPeerIds()

                for(var i in peerIds) {

                    var peerId = peerIds[i]

                    client.startUploading(peerId, client._sellerTerms)
                }

            },

            StartUploadingFailed : function (client, peerId, err) {

                var peer = client.getPeer(peerId)

                if(peer)
                    peer.failedToStartUploading(err)
            },

            StartedPaidUploading: function (client, peerId) {

                var peer = client.getPeer(peerId)

                if(peer)
                    peer.startUploading()
            },

            GoToPassive : function(client) {
                client.goToObserveMode()
                this.transition(client, 'GoingToObserveMode')
            }
        },

        StoppingExtension : {
            StoppedExtension : function (client) {
                client.stopLibtorrentTorrent()
                this.transition(client, 'StoppingLibtorrentTorrent')
            }
        },

        StoppingLibtorrentTorrent: {
            StoppedLibtorrentTorrent : function (client) {
                this.transition(client, 'Stopped')
            }
        },

        ChangingSellerTerms : {

            ChangedSellerTerms: function (client) {

                // Keep new terms
                client._sellerTerms = client._newSellerTerms

                // Drop temporary terms storage
                delete client._newSellerTerms

                this.transition(client, 'Started')
            }

        },

        Stopped: {

            Start: function (client) {
                client.startLibtorrentTorrent()
                this.transition(client, 'StartingLibtorrentTorrent')
            },

            GoToPassive: function (client) {
                client.startExtension()
                this.transition(client, 'StartingExtensionForPassiveMode')
            }

        },

        StartingExtensionForPassiveMode: {
            StartedExtension: function (client) {
                client.goToObserveMode()
                this.transition(client, 'GoingToObserveMode')
            }
        },

        GoingToObserveMode : {
            StartedObserveMode: function (client) {
                this.transition(client, 'Passive')
            }
        },

        StartingLibtorrentTorrent: {
            StartedLibtorrentTorrent: function (client) {
                client.startedExtension()
                this.transition(client, 'StartingExtension')
            }
        },

        StartingExtension: {
            StartedExtension: function (client) {
                this.transition(client, 'Started')
            }
        }
    }

})

export default Uploading