/**
 * Created by bedeho on 27/06/17.
 */

var machina = require('machina')

var ConnectionInnerState = require('joystream-node')
var areTermsMatching = require('joystream-node/lib/utils')

var Peer = new machina.BehavioralFsm({

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
                    status.connection.innerState !== ConnectionInnerState.Invited)
                    return

                // Make request to start uploading
                var infoHash = client.infoHash()
                var peerId = status.connection.pid
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
                    status.connection.innerState !== ConnectionInnerState.WaitingToStart
                        &&
                    status.connection.innerState !== ConnectionInnerState.ReadyForPieceRequest
                        &&
                    status.connection.innerState !== ConnectionInnerState.LoadingPiece
                        &&
                    status.connection.innerState !== ConnectionInnerState.WaitingForPayment))
                    this.transition(client, 'ReadyForStartPaidUploadAttempt')
            }

        }
    }

})

module.exports = Peer