/**
 * Created by bedeho on 13/06/17.
 */

var BaseMachine = require('../../BaseMachine')
var DeepInitialState = require('./DeepInitialState').DeepInitialState
var isUploading = require('./DeepInitialState').isUploading
var isPassive = require('./DeepInitialState').isPassive
var isDownloading = require('./DeepInitialState').isDownloading
var isStopped = require('./DeepInitialState').isStopped

var Loading = new BaseMachine({

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

                // Remember this information for when we make transition to active state later
                // because we first have to blck uploading.
                client._isFullyDownloaded = isFullyDownloaded

                // By default, extension torrent plugins are constructed with
                // TorrentPlugin::LibtorrentInteraction::None:
                // - No events interrupted, except on_extended events for this plugin.
                // Since we _never_ want libtorrent to seed for us over vanilla BitTorrent
                // protocol, even when we are uploading (we only allow
                // paid seeding in app), we instead want
                // TorrentPlugin::LibtorrentInteraction::BlockDownloading:
                // - Preventing uploading to peers by
                // -- sending (once) CHOCKED message in order to discourage inbound requests.
                // -- cancel on_request() to make libtorrent blind to peer requests.
                client.setLibtorrentInteractionToBlockedUploading()

                this.transition(client, 'BlockingLibtorrentUploading')
            }

        },

        BlockingLibtorrentUploading : {

            blocked : function (client) {

                if(client._isFullyDownloaded) {

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

                        this.transition(client, 'WaitingForMissingBuyerTerms')
                    }
                }

                // Drop temporary memory
                delete client._isFullyDownloaded
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

            startedExtension : function (client) {
                goToDeepInitialState(this, client)
            }
        }
    }
})

function goToDeepInitialState(machine, client) {

    // Path to active substate we need to transition to
    var path = relativePathFromDeepInitialState(client._deepInitialState)

    // Transition to active state
    machine.go(client, path)

    // Notify user that we are done
    client.loaded(client._deepInitialState)

    // Drop temprorary storage of inital state we want to load to
    delete client._deepInitialState
}

function relativePathFromDeepInitialState(s) {

    switch(s) {
        case DeepInitialState.DOWNLOADING.UNPAID.STARTED:
            return '../Active/DownloadIncomplete/Unpaid/Started/CannotStartPaidDownload'
        case DeepInitialState.DOWNLOADING.UNPAID.STOPPED:
            return '../Active/DownloadIncomplete/Unpaid/Stopped'
        case DeepInitialState.DOWNLOADING.PAID.STARTED:
            return '../Active/DownloadIncomplete/Paid/Started'
        case DeepInitialState.DOWNLOADING.PAID.STOPPED:
            return '../Active/DownloadIncomplete/Paid/Stopped'
        case DeepInitialState.PASSIVE:
            return '../Active/FinishedDownloading/Passive'
        case DeepInitialState.UPLOADING.STARTED:
            return '../Active/FinishedDownloading/Uploading/Started'
        case DeepInitialState.UPLOADING.STOPPED:
            return '../Active/FinishedDownloading/Uploading/Stopped'
    }

}

module.exports = Loading