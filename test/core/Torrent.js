/**
 * Created by bedeho on 04/07/17.
 */

var assert = require('chai').assert
var sinon = require('sinon')
//var InnerStateTypeInfo = require('joystream-node').InnerStateTypeInfo
var DeepInitialState = require('../../src/core/Torrent/Statemachine/DeepInitialState').DeepInitialState
var Torrent = require('../../src/core/Torrent/Statemachine/Torrent')

describe('Torrent state machine', function () {

    describe('Incomplete download with upload setings' , function () {

        let client = new SpyClient()
        let fixture = {

        }
        
        it('...', function () {
            
        })

    })

    describe('Terminate while loading' , function () {

        let client = new SpyClient()
        let fixture = {

        }

        it('...', function () {

        })

    })

    describe('Full downloading->passive->uploading lifecycle', function() {

        let client = new SpyClient()

        let fixture = {
            infoHash: "my_info_hash",
            savePath: "save_path",
            resumeData: "resume_data",
            metadata: null,
            deepInitialState: DeepInitialState.DOWNLOADING.UNPAID.STOPPED,
            extensionSettings: {
                buyerTerms : {
                    minNumberOfSellers : 1
                }
            }
        }

        it('starts loading', function () {

            client.addTorrent.reset()

            Torrent.queuedHandle(client, 'startLoading',
                                    fixture.infoHash,
                                    fixture.savePath,
                                    fixture.resumeData,
                                    fixture.metadata,
                                    fixture.deepInitialState,
                                    fixture.extensionSettings)

            // Client was correctly called
            assert.isOk(client.addTorrent.calledWith(fixture.infoHash,
                                                        fixture.savePath,
                                                        true, // addAsPaused,
                                                        false, // addAsPaused
                                                        fixture.metadata))

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

            client.setLibtorrentInteractionToBlockedUploading.reset()

            Torrent.queuedHandle(client, 'checkFinished', false) // isFullyDownloaded == false

            assert.isOk(client.setLibtorrentInteractionToBlockedUploading.calledOnce)

            assert.equal(Torrent.compositeState(client), 'Loading.BlockingLibtorrentUploading', 'Did not wait for blocking uploading')
        })

        it('libtorrent uploading blocked', function () {

            client.goToBuyMode.reset()

            Torrent.queuedHandle(client, 'blocked')

            assert.isOk(client.goToBuyMode.calledWith(fixture.extensionSettings.buyerTerms))

            assert.equal(Torrent.compositeState(client), 'Loading.GoingToMode', 'Did not wait to go to mode')

        })

        it('went to buy mode', function () {

            client.loaded.reset()

            Torrent.queuedHandle(client, 'wentToBuyMode')
            
            assert.isOk(client.loaded.calledWith(fixture.deepInitialState))

            assert.equal(Torrent.compositeState(client), 'Active.DownloadIncomplete.Unpaid.Stopped', 'Did not end up in stopped, unpaid, incomplete download state')

        })

        it('start', function () {

            client.startLibtorrentTorrent.reset()

            Torrent.queuedHandle(client, 'start')

            assert.isOk(client.startLibtorrentTorrent.calledOnce)

            assert.equal(Torrent.compositeState(client), 'Active.DownloadIncomplete.Unpaid.StartingLibtorrentTorrent', 'Did not begin start libtorrent torrent')

            ///

            client.startExtension.reset()

            Torrent.queuedHandle(client, 'startedLibtorrentTorrent')

            assert.isOk(client.startExtension.calledOnce)

            assert.equal(Torrent.compositeState(client), 'Active.DownloadIncomplete.Unpaid.StartingExtension', 'Did not begin starting extension')

            ///

            Torrent.queuedHandle(client, 'startedExtension')

            assert.equal(Torrent.compositeState(client), 'Active.DownloadIncomplete.Unpaid.Started.CannotStartPaidDownload', 'Did not begin starting extension')

        })

        it('process peer plugins for paid download', function () {

            /// pump in peerpluigins which brings to 'CanStartPaidDownload'

            let statuses = []
            statuses.push(makePeerPluginStatus('id-1'))
            statuses.push(makePeerPluginStatus('id-2'))
            statuses.push(makePeerPluginStatus('id-3'))

            Torrent.queuedHandle(client, 'processPeerPluginsStatuses', statuses)

            //assert.isOk(client.addPeer.firstCall)

            /// pump in peerplugins which brings back to 'CannotStartPaidDownload' again

            statuses = []
            statuses.push(makePeerPluginStatus('id-1' , 0))

            Torrent.queuedHandle(client, 'processPeerPluginsStatuses', statuses)

            // x peers, but none in right state
            // assert.isOk(client.)
        })

        it('paid download', function () {

            ///

            // pump in peerplugins which brings to 'CanStartPaidDownload'

            ///

            // startPaidDownload event moves to 'SigningContract'

            ///

            // trigger contractSigned, moves to 'InitiatingPaidDownload'

            ///

            // trigger paidDownloadInitiationCompleted, moves to '../../Paid/Started'

        })

        it('finish download' , function() {

            ///

            client.goToObserveMode.reset()

            Torrent.queuedHandle(client, 'downloadFinished')

            assert.isOk(client.goToObserveMode.calledOnce)

            assert.equal(Torrent.compositeState(client), 'Active.FinishedDownloading.GoingToPassive', 'Did not begin going to passive')

            ///

            Torrent.queuedHandle(client, 'startedObserveMode')
            assert.equal(Torrent.compositeState(client), 'Active.FinishedDownloading.Passive', 'Did not go to passive mode')
        })

    })

    describe('Direct to passive flow', function() {

        let client = new SpyClient()

        it('...', function () {

            Torrent.queuedHandle(client, 'startLoading',
                'info_hash',
                'save-path',
                null,
                null,
                DeepInitialState.PASSIVE,
                {})

            Torrent.queuedHandle(client, 'added')

            Torrent.queuedHandle(client, 'metadataReady')

            Torrent.queuedHandle(client, 'checkFinished', true) // isFullyDownloaded

            Torrent.queuedHandle(client, 'blocked')
            
        })

    })

    describe('Direct to uploading flow', function () {

        let client = new SpyClient()
        
        it('get to uploading', function () {

            // just get there

        })

        it('paid upload' , function () {

            // get a paid uploading to start

        })

    })

})

function makePeerPluginStatus(id, innerState) {
    return {
        peerId : id,
        connection : {
            innerState : innerState // || InnerStateTypeInfo.PreparingContract
        }
    }
}

function SpyClient() {

    this.peers =
    this.addTorrent = sinon.spy()
    this.stopExtension = sinon.spy()
    this.startExtension = sinon.spy()
    this.startLibtorrentTorrent = sinon.spy()
    this.startLibtorrentTorrent = sinon.spy()
    this.generateResumeData = sinon.spy()
    this.terminated = sinon.spy()
    this.setLibtorrentInteractionToBlockedUploading = sinon.spy()
    this.goToObserveMode = sinon.spy()
    this.goToSellMode = sinon.spy()
    this.goToBuyMode = sinon.spy()
    this.provideBuyerTerms = sinon.spy()
    this.loaded = sinon.spy()
    //this.downloadFinished  = sinon.spy()
    this.changeSellerTerms = sinon.spy()
    //this.getPeer: function(peerId) {},
    this.startUploading = sinon.spy()

    this.updatePeerPluginStatus = sinon.spy()
    this.addPeer = sinon.spy()
    this.removePeer = sinon.spy()
}

SpyClient.prototype.resetSpies = function() {
    throw new Error('Not implemented yet!')
}

SpyClient.prototype.peerExits = function(peerId) {
    return this.peers.peerId != undefined
}

SpyClient.prototype.allPeerIds = function () {
    
}