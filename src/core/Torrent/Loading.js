/**
 * Created by bedeho on 13/06/17.
 */

import machina from 'machina'
import {go} from '../utils'

import DeepInitialState, {isUploading, isPassive, isDownloading, isStopped} from './DeepInitialState'

var Loading = new machina.BehavioralFsm({

    initialize: function (options) {
    },

    initialState: "AddingToSession",

    states: {

        AddingToSession : {

            added: function (client) {

                // If we don´t have metadata, wait for it
                if(!client._metadata) {
                    this.transition(client, 'WaitingForMetadata')
                } else {
                    this.transition(client, 'CheckingPartialDownload')
                }

            },

            failedAdding : function (client) {
                this.transition(client, 'FailedAdding')
            }

        },

        FailedAdding : {

            // This handler is input sink, preventing any further processing by parent. In the future we may add some handling of secondary attempts
            '*' : function(client) {
                //
            }
        },

        WaitingForMetadata : {

            metadataReady : function (client, metadata) {

                // Hold on to metadata, is required when shutting down
                client._metadata = metadata

                this.transition(client, 'CheckingPartialDownload')
            }
        },

        CheckingPartialDownload: {

            checkFinished: function (client, isFullyDownloaded) {

                if(isFullyDownloaded) {

                    if(isPassive(client._deepInitialState) || isDownloading(client._deepInitialState)) {

                        // When there is a full download, and the user doesnt want to upload, then
                        // we just go to passive, even if the user really wanted to download.
                        client.goToObserveMode()

                        client._deepInitialState = DeepInitialState.PASSIVE

                    } else { // isUploading

                        client.goToSellMode(client._sellerTerms)
                    }

                    this.transition(client, 'GoingToMode')

                } else {

                    // We go to buy mode, regardless of what the user wanted (DeepInitialState),
                    // user will need to supply terms on their own.

                    if(isDownloading(client._deepInitialState))  {

                        client.goToBuyMode(client._buyerTerms)

                        this.transition(client, 'GoingToMode')

                    } else { // isPassive || isUploading

                        // Overrule users wish, force (unpaid+started) downloading
                        client._deepInitialState = DeepInitialState.DOWNLOADING.UNPAID.STARTED

                        // Ask user to supply buyer terms
                        client.provideBuyerTerms()

                        this.transition(client, 'WaitingForNewBuyerTerms')
                    }
                }
            }

        },

        WaitingForMissingBuyerTerms : {

            termsReady : function(client, terms) {

                // Hold on to terms
                client._buyerTerms = terms

                client.goToBuyMode(terms)

                this.transition(client, 'GoingToMode')
            }
        },

        GoingToMode : {

            wentToBuyMode : function (client) {

                // Make sure we are supposed to go to downloading state
                if(!isDownloading(client._deepInitialState))
                    return

                // When not paused, then start extension,
                // otherwise leave extension un-started
                if(!isStopped(client._deepInitialState)) {

                    client.startExtension()
                    this.transition(client, 'StartingExtension')

                } else {
                    goToDeepInitialState(this, client)
                }
            },

            wentToSellMode : function (client) {

                // Make sure we are supposed to go to uploading state
                if(!isUploading(client._deepInitialState))
                    return

                if(!isStopped(client._deepInitialState)) {

                    client.startExtension()
                    this.transition(client, 'StartingExtension')
                } else {
                    goToDeepInitialState(this, client)
                }
            },

            wentToObserveMode : function (client) {

                // Make sure we are supposed to go to passive state
                if(!isPassive(client._deepInitialState))
                    return

                client.startExtension()
                this.transition(client, "StartingExtension")
            }

        },

        StartingExtension : {

            started : function (client) {
                goToDeepInitialState(this, client)
            }
        }
    },

    go : go,

    getDeepInitialState: function (client) {

    }

})

function goToDeepInitialState(machine, client) {

    // Path to active substate we need to transition to
    var path = PathToDeepInitialState(client._deepInitialState)

    // Transition to active state
    machine.go(client, path)

    // Notify user that we are done
    client.loaded(client._deepInitialState)

    // ...
    delete client._deepInitialState
}

function PathToDeepInitialState(s) {

    switch(s) {
        case DeepInitialState.UPLOADING.STARTED:
            return ['..', 'FinishedDownloading', 'Uploading', 'Started']
        case DeepInitialState.UPLOADING.STOPPED:
            return ['..', 'FinishedDownloading', 'Uploading', 'Stopped']
        case DeepInitialState.PASSIVE:
            return ['..', 'FinishedDownloading', 'Passive']
        case DeepInitialState.DOWNLOADING.UNPAID.STARTED:
            return ['..', 'Downloading', 'Unpaid', 'Started']
        case DeepInitialState.DOWNLOADING.UNPAID.STOPPED:
            return ['..', 'Downloading', 'Unpaid', 'Stopped']
        case DeepInitialState.DOWNLOADING.PAID.STARTED:
            return ['..', 'Downloading', 'Paid', 'Started']
        case DeepInitialState.DOWNLOADING.PAID.STOPPED:
            return ['..', 'Downloading', 'Paid', 'Stopped']
    }

}

export default Loading