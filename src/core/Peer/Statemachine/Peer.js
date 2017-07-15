/**
 * Created by bedeho on 27/06/17.
 */

var BaseMachine = require('../../BaseMachine')

var ConnectionInnerState = require('joystream-node').ConnectionInnerState

var Peer = new BaseMachine({

    initialState: "ReadyForStartPaidUploadAttempt",

    states: {

        //Uninitialized: {},

        ReadyForStartPaidUploadAttempt: {

            newStatus: function (client, status) {

                client.status = status

                // Buyer must have invited us
                if(!client.status.connection ||
                    client.status.connection.innerState !== ConnectionInnerState.Invited)
                    return

                // Make request to start uploading
                var buyerTerms = client.status.connection.announcedModeAndTermsFromPeer.buyer.terms
                var contractSk = client.generatePrivateKey()
                var finalPkHash = client.generatePublicKeyHash()

                // Store these here for closing out the payment channel
                client.contractSk = contractSk
                client.finalPkHash = finalPkHash


                client.startPaidUploading(buyerTerms, contractSk, finalPkHash)

                this.transition(client, 'StartingPaidUploading')
            }

        },

        StartingPaidUpload: {

            startPaidUploadingResult : function(client, err) {

                if(err)
                    this.transition(client, 'ReadyForStartPaidUploadAttempt')
                else
                    this.transition(client, 'PaidUploadingStarted')

            },

            newStatus : function (client, status) {

                client.status = status
            }

        },

        PaidUploadingStarted: {

            newStatus : function (client, status) {

                client.status = status

                // If there is a new state for the same peer which
                // indicates we moved out of active selling _after_
                // paid uploading was started, then we know the connection
                // was reset some how, e.g. by terms being reset, or a reconnection.

                if(!status.connection || (
                    status.connection.innerState !== ConnectionInnerState.WaitingToStart &&
                    status.connection.innerState !== ConnectionInnerState.ReadyForPieceRequest &&
                    status.connection.innerState !== ConnectionInnerState.LoadingPiece &&
                    status.connection.innerState !== ConnectionInnerState.WaitingForPayment))
                    this.transition(client, 'ReadyForStartPaidUploadAttempt')
            }

        }
    }

})

module.exports = Peer