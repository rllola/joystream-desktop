/**
 * Created by bedeho on 04/07/17.
 */

var assert = require('chai').assert
var sinon = require('sinon')
var DeepInitialState = require('../../src/core/Torrent/Statemachine/DeepInitialState').DeepInitialState
var Torrent = require('../../src/core/Torrent/Statemachine/Torrent')

describe('Torrent state machine', function () {

    describe('Incomplete download with upload setings' , function () {
        
        it('xxxx', function () {
            
        })

    })

    describe('Terminate while loading' , function () {

        it('xxxx', function () {

        })

    })

    describe('Normal downloading->passive->uploading lifecycle', function() {

        // Perhaps factor this out later
        // Perhap remove all callbacks, as we are doing
        // everythign with sinon?
        let client = {

                fixture : {

                    addTorrent : {
                        infoHash: "my_info_hash",
                        savePath: "save_path",
                        resumeData: "resume_data",
                        metadata: null,
                        deepInitialState: DeepInitialState.DOWNLOADING.UNPAID.STOPPED,
                        extensionSettings: {
                            buyerTerms : "my buyer terms!!!"
                        }
                    }
                },

                addTorrent : function(infoHash, savePath, addAsPaused, autoManaged, metadata) {},

                stopExtension : function() {},

                startExtension : function () {},

                startLibtorrentTorrent() {},

                startLibtorrentTorrent() {},

                generateResumeData : function () {},

                terminated : function (state) {},

                setLibtorrentInteractionToBlockedUploading : function () {},

                goToObserveMode : function () {},

                goToSellMode: function(terms) {},

                goToBuyMode: function (terms) {},

                provideBuyerTerms: function (terms) {},

                loaded: function(deepInitialState) {},

                downloadFinished: function () {},

                changeSellerTerms: function(sellerTerms) {},

                // synchronous
                allPeerIds: function() {

                    //returns var peerIds
                },

                getPeer: function(peerId) {},

                startUploading: function (peerId, sellerTerms) {}

            }

        it('starts loading', function () {

            client.addTorrent = sinon.spy()

            Torrent.queuedHandle(client, 'startLoading',
                                    client.fixture.addTorrent.infoHash,
                                    client.fixture.addTorrent.savePath,
                                    client.fixture.addTorrent.resumeData,
                                    client.fixture.addTorrent.metadata,
                                    client.fixture.addTorrent.deepInitialState,
                                    client.fixture.addTorrent.extensionSettings)

            // Client was correctly called
            assert.isOk(client.addTorrent.calledWith(client.fixture.addTorrent.infoHash,
                                                        client.fixture.addTorrent.savePath,
                                                        true, // addAsPaused,
                                                        false, // addAsPaused
                                                        client.fixture.addTorrent.metadata))

            // Went to correct next state
            assert.equal(Torrent.compositeState(client), 'Loading.AddingToSession', 'Did not go to right state after starting')

        })

        it('adding to session',  function() {

            Torrent.queuedHandle(client, 'added')

            assert.equal(Torrent.compositeState(client),'Loading.WaitingForMetadata', 'Did not wait for metadata after adding torrent')
        })

        it('metadata ready', function() {

            Torrent.queuedHandle(client, 'metadataReady')

            assert.equal(Torrent.compositeState(client), 'Loading.CheckingPartialDownload', 'Did not wait for partial download checking')
        })

        it('checking finished', function() {

            client.setLibtorrentInteractionToBlockedUploading = sinon.spy()

            Torrent.queuedHandle(client, 'checkFinished', false) // isFullyDownloaded == false

            assert.isOk(client.setLibtorrentInteractionToBlockedUploading.calledOnce)

            assert.equal(Torrent.compositeState(client), 'Loading.BlockingLibtorrentUploading', 'Did not wait for blocking uploading')
        })

        it('libtorrent uploading blocked', function () {

            client.goToBuyMode = sinon.spy()

            Torrent.queuedHandle(client, 'blocked')

            assert.isOk(client.goToBuyMode.calledWith(client.fixture.addTorrent.extensionSettings.buyerTerms))

            assert.equal(Torrent.compositeState(client), 'Loading.GoingToMode', 'Did not wait to go to mode')

        })

        it('went to buy mode', function () {

            client.loaded = sinon.spy()

            Torrent.queuedHandle(client, 'wentToBuyMode')
            
            assert.isOk(client.loaded.calledWith(client.fixture.addTorrent.deepInitialState))

            assert.equal(Torrent.compositeState(client), 'Active.DownloadIncomplete.Unpaid.Stopped', 'Did not end up in stopped, unpaid, incomplete download state')

        })

        it('start', function () {

            client.startLibtorrentTorrent = sinon.spy()

            Torrent.queuedHandle(client, 'start')

            assert.isOk(client.startLibtorrentTorrent.calledOnce)

            assert.equal(Torrent.compositeState(client), 'Active.DownloadIncomplete.Unpaid.StartingLibtorrentTorrent', 'Did not begin start libtorrent torrent')

            ///

            client.startExtension = sinon.spy()

            Torrent.queuedHandle(client, 'startedLibtorrentTorrent')

            assert.isOk(client.startExtension.calledOnce)

            assert.equal(Torrent.compositeState(client), 'Active.DownloadIncomplete.Unpaid.StartingExtension', 'Did not being starting extension')

            ///

            Torrent.queuedHandle(client, 'startedExtension')

            assert.equal(Torrent.compositeState(client), 'Active.DownloadIncomplete.Unpaid.StartingExtension', 'Did not being starting extension')



        })

        it('starting extension', function () {
            


        })

    })

    describe('Direct to uploading flow', function () {

        // same as above, but go straight to uploading

    })

})