/**
 * Created by bedeho on 27/06/17.
 */

import machina from 'machina'
import {go} from '../utils'

import InnerStateTypeInfo from 'joystream-node'
import areTermsMatching from 'joystream-node/lib/utils'

var Peer = machina.BehavioralFsm({

    initialize: function (options) {},

    initialState: "ReadyForStartPaidUploadAttempt",

    states: {

        //Uninitialized: {},

        ReadyForStartPaidUploadAttempt: {

            newStatus: function (client, status) {

                // Tell user to update status
                client.setStatus(status)

            },

            startPaidUploading : function (client, sellerTerms) {

                // Get most recent status
                var status = client.getStatus()

                // Buyer must have invited us
                if(!status.connection ||
                    status.connection.innerState !== InnerStateTypeInfo.Invited)
                    return

                // Check if buyer terms are compatible
                const buyerTerms = status.connection.announcedModeAndTermsFromPeer.buyer.terms

                if (!areTermsMatching(buyerTerms, sellerTerms))
                    return

                // Make request to start uploading
                var infoHash = client.infoHash()
                var peerId = status.connection.peerId()
                var contractSk = client.generatePrivateKey()
                var finalPkHash = client.getPublicKeyHash()

                client.startPaidUploading(infoHash, peerId, buyerTerms, contractSk, finalPkHash)

                this.transition(client, 'StartingPaidUploading')
            }

        },

        StartingPaidUpload: {

            failedToStartPaidUploading : function (client) {
                this.transition(client, 'ReadyForStartPaidUploadAttempt')
            },

            startedPaidUploading: function (client) {
                this.transition(client, 'PaidUploadingStarted')
            },

            newStatus : function (client, status) {

                // Tell user to update status
                client.setStatus(status)
            }

        },

        PaidUploadingStarted: {

            newStatus : function (client, status) {

                // Tell user to update status
                client.setStatus(status)

                // If there is a new state for the same peer which
                // indicates we moved out of active selling _after_
                // paid uploading was started, then we know the connection
                // was reset some how, e.g. by terms being reset, or a reconnection.

                if(!status.connection || (
                    status.connection.innerState !== InnerStateTypeInfo.WaitingToStart
                        &&
                    status.connection.innerState !== InnerStateTypeInfo.ReadyForPieceRequest
                        &&
                    status.connection.innerState !== InnerStateTypeInfo.LoadingPiece
                        &&
                    status.connection.innerState !== InnerStateTypeInfo.WaitingForPayment))
                    this.transition(client, 'ReadyForStartPaidUploadAttempt')
            }

        }
    }

})

export default Peer