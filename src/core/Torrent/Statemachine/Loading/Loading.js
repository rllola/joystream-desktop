/**
 * Created by bedeho on 13/06/17.
 */

var assert = require('assert')
var BaseMachine = require('../../../BaseMachine')
var LibtorrentInteraction = require('joystream-node').LibtorrentInteraction
var Common = require('./../Common')
var Torrent = require('../Torrent')

var Loading = new BaseMachine({

    initialState: "AddingToSession",

    states: {

        AddingToSession : {

            addTorrentResult: function (client, err, torrent) {

                if(err) {

                    this.transition(client, 'FailedAdding')

                } else {

                    // Hold on to torrent
                    client.torrent = torrent

                    // Hook into torrent events

                    torrent.on('metadata', (metadata) => {
                        //this._db.saveTorrent(torrent)

                        Torrent.queuedHandle(client, 'metadataReady', metadata)
                    })

                    torrent.on('resumedata', (resumeData) => {
                        //this._db.saveTorrentResumeData(infoHash, buff)

                        Torrent.queuedHandle(client, 'resumeDataGenerated', resumeData)
                    })

                    torrent.on('error', function(err) {

                        if(err.message == 'resume data generation failed')
                            Torrent.queuedHandle(client, 'resumeDataGenerationFailed')
                    })

                    torrent.on('status_update', function(statusUpdate) {
                        //this.setStatus(statusUpdate)
                    })

                    torrent.on('finished', function() {
                        Torrent.queuedHandle(client, 'downloadFinished')
                    })

                    torrent.on('checkFinished', function () {
                        Torrent.queuedHandle(client, 'checkFinished')
                    })

                    /**
                    torrent.on('sessionToSellMode', (alert) => {
                        if (this.loadingTorrents) return

                        this._db.saveTorrentSettings(infoHash, {
                            mode: SessionMode.selling,
                            sellerTerms: alert.terms
                            //state: observableTorrent.state
                        })
                    })

                    torrent.on('sessionToBuyMode', (alert) => {
                        if (this.loadingTorrents) return

                        this._db.saveTorrentSettings(infoHash, {
                            mode: SessionMode.buying,
                            buyerTerms: alert.terms
                            //state: observableTorrent.state
                        })
                    })

                    torrent.on('sessionToObserveMode', (alert) => {
                        if (this.loadingTorrents) return

                        this._db.saveTorrentSettings(infoHash, {
                            mode: SessionMode.observing
                            //state: observableTorrent.state
                        })
                    })
                     */

                    // If we don´t have metadata, wait for it
                    if(!client.metadata) {
                        this.transition(client, 'WaitingForMetadata')
                    } else {
                        this.transition(client, 'CheckingPartialDownload')
                    }
                }

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
                client.metadata = metadata

                this.transition(client, 'CheckingPartialDownload')
            }
        },

        CheckingPartialDownload: {

            checkFinished: function (client) {

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
                client.setLibtorrentInteraction(LibtorrentInteraction.BlockUploading)

                // Determine whether we have a full download

                var s = client.torrent.handle().status()

                if(s.is_finished()) {

                    if(Common.isPassive(client.deepInitialState) || Common.isDownloading(client.deepInitialState)) {

                        // When there is a full download, and the user doesn't want to upload, then
                        // we just go to passive, even if the user really wanted to download.
                        client.goToObserveMode()

                        client.deepInitialState = Common.DeepInitialState.PASSIVE

                        client.startExtension()

                    } else { // isUploading

                        client.goToSellMode(client.sellerTerms)

                        if(!Common.isStopped(client.deepInitialState))
                            client.startExtension()
                    }

                    goToDeepInitialState(this, client)

                } else {

                    // We go to buy mode, regardless of what the user wanted (DeepInitialState),
                    // user will need to supply terms on their own.

                    if(Common.isDownloading(client.deepInitialState))  {

                        client.goToBuyMode(client.buyerTerms)

                        // When not paused, then start extension, otherwise leave extension un-started
                        if(!Common.isStopped(client.deepInitialState))
                            client.startExtension()

                        goToDeepInitialState(this, client)

                    } else { // isPassive || isUploading

                        // Overrule users wish, force (unpaid+started) downloading
                        client.deepInitialState = Common.DeepInitialState.DOWNLOADING.UNPAID.STARTED

                        this.transition(client, 'WaitingForMissingBuyerTerms')
                    }
                }

            }

        },

        WaitingForMissingBuyerTerms : {

            termsReady : function(client, terms) {

                // Hold on to terms
                client.buyerTerms = terms

                client.goToBuyMode(terms)

                // When not paused, then start extension, otherwise leave extension un-started
                if(!Common.isStopped(client.deepInitialState))
                    client.startExtension()

                goToDeepInitialState(this, client)
            }
        }
    }
})

function goToDeepInitialState(machine, client) {

    // Path to active substate we need to transition to
    var path = relativePathFromDeepInitialState(client.deepInitialState)

    // Transition to active state
    machine.go(client, path)

    // Drop temprorary storage of inital state we want to load to
    delete client.deepInitialState
}

function relativePathFromDeepInitialState(s) {

    switch (s) {
        case Common.DeepInitialState.DOWNLOADING.UNPAID.STARTED:
            return '../Active/DownloadIncomplete/Unpaid/Started/CannotStartPaidDownload'
        case Common.DeepInitialState.DOWNLOADING.UNPAID.STOPPED:
            return '../Active/DownloadIncomplete/Unpaid/Stopped'
        case Common.DeepInitialState.DOWNLOADING.PAID.STARTED:
            return '../Active/DownloadIncomplete/Paid/Started'
        case Common.DeepInitialState.DOWNLOADING.PAID.STOPPED:
            return '../Active/DownloadIncomplete/Paid/Stopped'
        case Common.DeepInitialState.PASSIVE:
            return '../Active/FinishedDownloading/Passive'
        case Common.DeepInitialState.UPLOADING.STARTED:
            return '../Active/FinishedDownloading/Uploading/Started'
        case Common.DeepInitialState.UPLOADING.STOPPED:
            return '../Active/FinishedDownloading/Uploading/Stopped'
    }

    assert(false)
}

module.exports = Loading