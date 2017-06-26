/**
 * Created by bedeho on 26/06/17.
 */


import machina from 'machina'
import {go} from '../utils'

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


                // Join contracts for all suitable peers, that is

                for(var p in statuses) {

                    if(!client.peerExists(p.peerID)) {
                        client.addPeer(p.status)
                    } else {
                        client.updatePeerStatus(p.peerID, p.status)

                        //

                    }


                }

                // Drop peer with no uploads ?

                    // add: for p in s: peers.add(new peer(s)) when i is not in peers
                    // x: for p in peers: peers.remove(p) when  p.state != waiting_toStart_paid_upload && !p in s
                    // x: for p in peers: p.startUploading() when p.state == waiting for start pad upload attempt && peerIsSuitable(peer_id, terms) ?
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