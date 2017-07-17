/**
 * Created by bedeho on 04/07/17.
 */

var assert = require('chai').assert
var sinon = require('sinon')
var EventEmitter = require('events').EventEmitter
var util = require('util')

var ConnectionInnerState = require('joystream-node').ConnectionInnerState
var Common = require('../../src/core/Torrent/Statemachine/Common')
var Torrent = require('../../src/core/Torrent/Statemachine/Torrent')

/**
 *
 * NB! Within a given describe where a client instance lives, the order of
 * specific tests (it) are important most of the time, so change with care.
 *
 */

describe('Torrent state machine', function () {

    describe('recovers from incomplete download with upload settings' , function () {

        let client = new TorrentClientSpy()

        let fixture = {
            infoHash: "my_info_hash",
            name: "my_torrent_name",
            savePath: "save_path",
            resumeData: null,
            metadata: "my-metadata",
            deepInitialState: Common.DeepInitialState.UPLOADING.STOPPED,
            extensionSettings: {
                sellerTerms : {}
            },
            isFullyDownloaded: false
        }

        let torrent = new MockTorrent(fixture)

        it('waits for buyer terms', function () {

            handleSequence(Torrent,
                            client,
                            fixtureToStartLoadingInput(fixture),
                            ['addTorrentResult', null, torrent],
                            'metadataReady',
                            fixtureToCheckFinishedInput(fixture),
                            'setLibtorrentInteractionResult')

            assert.equal(Torrent.compositeState(client), 'Loading.WaitingForMissingBuyerTerms')

        })

        it('gets started downloading', function() {

            handleSequence(Torrent,
                            client,
                            'termsReady',
                            'toBuyModeResult',
                            'startExtensionResult')

            assert.equal(Torrent.compositeState(client), 'Active.DownloadIncomplete.Unpaid.Started.CannotStartPaidDownload')
            
        })

    })

    describe('terminate while loading' , function () {

        let client = new TorrentClientSpy()

        let fixture = {
            infoHash: "my_info_hash",
            name: "my_torrent_name",
            savePath: "save_path",
            resumeData: null,
            metadata: "my-metadata",
            deepInitialState: Common.DeepInitialState.UPLOADING.STOPPED,
            extensionSettings: {
                sellerTerms : {}
            },
            isFullyDownloaded: false,
            generateResumeData : true
        }

        let torrent = new MockTorrent(fixture)

        it('terminates', function () {

            handleSequence(Torrent, client,
                            fixtureToStartLoadingInput(fixture),
                            ['addTorrentResult', null, torrent],
                            'metadataReady',
                            fixtureToCheckFinishedInput(fixture),
                            fixtureToTerminateInput(fixture))

            assert.equal(Torrent.compositeState(client), 'Terminated')
        })

    })

    describe('Full downloading->passive->uploading lifecycle', function() {

        let client = new TorrentClientSpy()

        let fixture = {
            infoHash: "my_info_hash",
            name: "my_torrent_name",
            savePath: "save_path",
            resumeData: "resume_data",
            metadata: null,
            deepInitialState: Common.DeepInitialState.DOWNLOADING.UNPAID.STOPPED,
            extensionSettings: {
                buyerTerms : {
                    minNumberOfSellers : 1
                }
            }
        }

        let torrent = new MockTorrent(fixture)

        it('adds torrent to session', function () {

            handleSequence(Torrent,
                            client,
                            fixtureToStartLoadingInput(fixture))

            assert.equal(client.addTorrent.callCount, 1)
            assert.equal(client.addTorrent.getCall(0).args[0], fixture.infoHash)
            assert.equal(client.addTorrent.getCall(0).args[1], fixture.name)
            assert.equal(client.addTorrent.getCall(0).args[2], fixture.savePath)
            assert.equal(client.addTorrent.getCall(0).args[3], Common.isStopped(fixture.deepInitialState)) // addAsPaused,
            assert.equal(client.addTorrent.getCall(0).args[4], false) // addAsAutomanaged
            assert.equal(client.addTorrent.getCall(0).args[5], fixture.metadata)
            assert.equal(client.addTorrent.getCall(0).args[6], fixture.resumeData) // addAsAutomanaged

            assert.equal(Torrent.compositeState(client), 'Loading.AddingToSession')

        })

        it('waits for metadata',  function() {

            Torrent.queuedHandle(client, 'addTorrentResult', null, torrent)

            assert.equal(Torrent.compositeState(client),'Loading.WaitingForMetadata')
        })

        it('checks partial download', function() {

            Torrent.queuedHandle(client, 'metadataReady')

            assert.equal(Torrent.compositeState(client), 'Loading.CheckingPartialDownload')
        })

        it('went to unpaid stopped downloading', function() {

            Torrent.queuedHandle(client, 'checkFinished', false) // isFullyDownloaded == false

            assert.equal(client.setLibtorrentInteraction.callCount, 1)
            assert.equal(client.goToBuyMode.callCount, 1)
            assert.deepEqual(client.goToBuyMode.getCall(0).args[0], fixture.extensionSettings.buyerTerms)
            assert.equal(Torrent.compositeState(client), 'Active.DownloadIncomplete.Unpaid.Stopped')

        })

        it('start downloading', function () {

            client.startLibtorrentTorrent.reset()
            client.startExtension.reset()

            Torrent.queuedHandle(client, 'start')

            assert.equal(client.startLibtorrentTorrent.callCount, 1)
            assert.equal(client.startExtension.callCount, 1)
            assert.equal(Torrent.compositeState(client), 'Active.DownloadIncomplete.Unpaid.Started.CannotStartPaidDownload')

        })

        it('handleSequence peer plugins for paid download', function () {

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

            client.goToObserveMode.reset()

            Torrent.queuedHandle(client, 'downloadFinished')

            assert.equal(client.goToObserveMode.callCount, 1)
            assert.equal(Torrent.compositeState(client), 'Active.FinishedDownloading.Passive')
        })

    })

    describe('Direct to passive flow', function() {

        let client = new TorrentClientSpy()

        let fixture = {
            infoHash: "my_info_hash",
            name: "my_torrent_name",
            savePath: "save_path",
            resumeData: "resume_data",
            metadata: null,
            deepInitialState: Common.DeepInitialState.PASSIVE,
            extensionSettings: {},
            isFullyDownloaded: true
        }

        let torrent = new MockTorrent(fixture)

        it('gets to passive', function () {

            handleSequence(Torrent, client,
                fixtureToStartLoadingInput(fixture),
                ['addTorrentResult', null, torrent],
                'metadataReady',
                fixtureToCheckFinishedInput(fixture)
            )

            assert.equal(Torrent.compositeState(client), 'Active.FinishedDownloading.Passive')
        })

        it('then to uploading', function() {

            let sellerTerms = {
                x : 123
            }

            Torrent.queuedHandle(client, 'goToStartedUploading', sellerTerms)

            assert.equal(Torrent.compositeState(client), 'Active.FinishedDownloading.Uploading.Started')
            assert.equal(client.goToSellMode.callCount, 1)
            assert.deepEqual(client.goToSellMode.getCall(0).args[0], sellerTerms)
        })

        it('then back to passive', function() {

            Torrent.queuedHandle(client, 'goToPassive')



        })

    })

    describe('Direct to uploading flow', function () {

        let client = new TorrentClientSpy()

        let fixture = {
            infoHash: "my_info_hash",
            name: "my_torrent_name",
            savePath: "save_path",
            resumeData: "resume_data",
            metadata: null,
            deepInitialState: Common.DeepInitialState.UPLOADING.STOPPED,
            extensionSettings: {
                sellerTerms : {}
            },
            updateSellerTerms : {
                sellerTerms : {
                    xxx : 1
                }
            },
            isFullyDownloaded: true
        }

        let torrent = new MockTorrent(fixture)
        
        it('gets to (stopped) uploading', function () {

            handleSequence(Torrent, client,
                fixtureToStartLoadingInput(fixture),
                ['addTorrentResult', null, torrent],
                'metadataReady',
                fixtureToCheckFinishedInput(fixture)
            )

            assert.equal(Torrent.compositeState(client), 'Active.FinishedDownloading.Uploading.Stopped')
        })

        it('starts', function () {

            Torrent.queuedHandle(client, 'start')

            assert.equal(client.startLibtorrentTorrent.callCount, 1)
            assert.isOk(client.startExtension.callCount, 1)
            assert.equal(Torrent.compositeState(client), 'Active.FinishedDownloading.Uploading.Started')
        })

        it('changes seller terms', function () {

            Torrent.queuedHandle(client, 'updateSellerTerms', fixture.updateSellerTerms.sellerTerms)

            assert.equal(client.updateSellerTerms.callCount, 1)
            assert.deepEqual(client.updateSellerTerms.getCall(0).args[0], fixture.updateSellerTerms.sellerTerms)
            assert.equal(Torrent.compositeState(client), 'Active.FinishedDownloading.Uploading.Started')
        })

        it('starts paid upload' , function () {


            ///

            var statuses = []

            Torrent.queuedHandle(client, 'processPeerPluginStatuses', statuses)


            ///

            // startUploadingFailed

            ///

            // startedPaidUploading


        })
        
        it('goes back to passive', function () {

            ///

            Torrent.queuedHandle(client, 'goToPassive')

            assert.equal(client.updateSellerTerms.callCount, 1)
            assert.deepEqual(client.updateSellerTerms.getCall(0).args[0], fixture.updateSellerTerms.sellerTerms)
            assert.equal(Torrent.compositeState(client), 'Active.FinishedDownloading.Passive')

            ///

            //

            ///

            //
            
        })

    })

})

function makePeerPluginStatus(id, innerState) {
    return {
        peerId : id,
        connection : {
            innerState : innerState // || ConnectionInnerState.PreparingContract
        }
    }
}

function TorrentClientSpy() {

    this.store = new MockStore()

    this.addTorrent = sinon.spy()
    this.stopExtension = sinon.spy()
    this.startExtension = sinon.spy()
    this.startLibtorrentTorrent = sinon.spy()
    this.generateResumeData = sinon.spy()
    //this.terminated = sinon.spy()
    this.setLibtorrentInteraction = sinon.spy()
    this.goToObserveMode = sinon.spy()
    this.goToSellMode = sinon.spy()
    this.goToBuyMode = sinon.spy()
    //this.provideBuyerTerms = sinon.spy()
    //this.loaded = sinon.spy()
    this.startUploading = sinon.spy()
    this.updateSellerTerms = sinon.spy()
    //this.downloadFinished  = sinon.spy()
    //this.getPeer: function(peerId) {},
    this.updatePeerPluginStatus = sinon.spy()
    //this.addPeer = sinon.spy()
    //this.removePeer = sinon.spy()
}

TorrentClientSpy.prototype.resetSpies = function() {

    this.addTorrent.reset()
    this.stopExtension.reset()
    this.startExtension.reset()
    this.startLibtorrentTorrent.reset()
    this.generateResumeData.reset()
    //this.terminated.reset()
    this.setLibtorrentInteraction.reset()
    this.goToObserveMode.reset()
    this.goToSellMode.reset()
    this.goToBuyMode.reset()
    //this.provideBuyerTerms.reset()
    //this.loaded.reset()
    //this.downloadFinished  = sinon.spy()
    this.startUploading.reset()
    this.updateSellerTerms.reset()
    //this.getPeer: function(peerId) {},
    this.updatePeerPluginStatus.reset()

    //this.addPeer.reset()
    //this.removePeer.reset()

    // these are all stubs??
}

///

function MockStore() {
    this.setMetadata = sinon.spy()
    this.setPeers = sinon.spy()
}

/// MockTorrent

util.inherits(MockTorrent, EventEmitter)

function MockTorrent(fixture) {

    EventEmitter.call(this);
    
    this._fixture = fixture

    this._handle = new MockTorrentHandle(fixture)

    // Setup spies?/ stubs?
}

MockTorrent.prototype.handle = function () {
    return this._handle
}

/// HandleSpy

function MockTorrentHandle(fixture) {

    this._fixture = fixture
    this._status = new MockTorrentStatus(fixture)
}

MockTorrentHandle.prototype.status = function () {
    return this._status
}

/// MockTorrentStatus

function MockTorrentStatus(fixture) {
    this._fixture = fixture
}

MockTorrentStatus.prototype.is_finished = function() {
    return this._fixture.isFullyDownloaded
}


function fixtureToStartLoadingInput(fix) {

    return [
        'startLoading',
        fix.infoHash,
        fix.name,
        fix.savePath,
        fix.resumeData,
        fix.metadata,
        fix.deepInitialState,
        fix.extensionSettings
    ]

}

function fixtureToCheckFinishedInput(fix) {

    if(fix.isFullyDownloaded === undefined)
        throw new Error('isFullyDownloaded undefined')

    return [
        'checkFinished',
        fix.isFullyDownloaded
    ]
}

function fixtureToTerminateInput(fix) {

    if(fix.generateResumeData === undefined)
        throw new Error('generateResumeData undefined')

    return [
        'terminate',
        fix.generateResumeData
    ]
}

/// Move this onto Basemachine later?

function handleSequence(machine, client) {

    // arguments[2,...] : String, for subroutine, array with params, for function call

    for(var i = 2;i < arguments.length;i++)
        SubmitEventToBasemachine(machine, client, arguments[i])
}

function SubmitEventToBasemachine(machine, client, input) {

    if(typeof input === 'string')
        machine.queuedHandle(client, input)
    else if(input instanceof Array) // === 'array'
        machine.queuedHandle.apply(machine, [client].concat(input))
    else
        throw new Error('Bad event type passed')
}