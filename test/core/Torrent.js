/**
 * Created by bedeho on 04/07/17.
 */

var assert = require('chai').assert
var sinon = require('sinon')
var ConnectionInnerState = require('joystream-node').ConnectionInnerState
var DeepInitialState = require('../../src/core/Torrent/Statemachine/DeepInitialState').DeepInitialState
var Torrent = require('../../src/core/Torrent/Statemachine/Torrent')

/**
 *
 * NB! Within a given describe where a client instance lives, the order of
 * specific tests (it) are important most of the time, so change with care.
 *
 */

describe('Torrent state machine', function () {

    describe('Incomplete download with upload setings' , function () {

        let client = new TorrentSpyClient()

        let fixture = {
            infoHash: "my_info_hash",
            savePath: "save_path",
            resumeData: null,
            metadata: "my-metadata",
            deepInitialState: DeepInitialState.UPLOADING.STOPPED,
            extensionSettings: {
                sellerTerms : {}
            },
            isFullyDownloaded: false
        }

        it('asks for buyer terms', function () {

            handleSequence(Torrent,
                            client,
                            fixtureToStartLoadingInput(fixture),
                            'added',
                            'metadataReady',
                            fixtureToCheckFinishedInput(fixture),
                            'blocked')

            assert.isOk(client.provideBuyerTerms.calledOnce)
            assert.equal(Torrent.compositeState(client), 'Loading.WaitingForMissingBuyerTerms')

        })

        it('gets started downloading', function() {

            handleSequence(Torrent,
                            client,
                            'termsReady',
                            'wentToBuyMode',
                            'startedExtension')

            assert.equal(Torrent.compositeState(client), 'Active.DownloadIncomplete.Unpaid.Started.CannotStartPaidDownload')
            
        })

    })

    describe('Terminate while loading and generate resume data' , function () {

        let client = new TorrentSpyClient()

        let fixture = {
            infoHash: "my_info_hash",
            savePath: "save_path",
            resumeData: null,
            metadata: "my-metadata",
            deepInitialState: DeepInitialState.UPLOADING.STOPPED,
            extensionSettings: {
                sellerTerms : {}
            },
            isFullyDownloaded: false,
            generateResumeData : true
        }

        it('stops extension', function () {

            handleSequence(Torrent,
                            client,
                            fixtureToStartLoadingInput(fixture),
                            'added',
                            'metadataReady',
                            fixtureToCheckFinishedInput(fixture),
                            fixtureToTerminateInput(fixture)
            )

            assert.isOk(client.stopExtension.calledOnce)
            assert.equal(Torrent.compositeState(client), 'StoppingExtension')
        })
        
        it('generates resume data', function () {

            client.generateResumeData.reset()
            Torrent.queuedHandle(client, 'stoppedExtension')

            assert.isOk(client.generateResumeData.calledOnce)
            assert.equal(Torrent.compositeState(client), 'GeneratingResumeData')

        })
        
        it('terminates', function () {

            client.terminated.reset()

            let myResumeData = 'jsafjadskljfkadlsøjf'

            Torrent.queuedHandle(client, 'generatedResumeData', myResumeData)

            assert.equal(client.terminated.callCount, 1)
            assert.deepEqual(client.terminated.getCall(0).args[0], {
                infoHash : fixture.infoHash,
                savePath : fixture.savePath,
                resumeData: myResumeData,
                metadata: fixture.metadata,
                deepInitialState: fixture.deepInitialState,
                extensionSettings: fixture.extensionSettings
            })

            assert.equal(Torrent.compositeState(client), 'Terminated')
        })

    })

    describe('Full downloading->passive->uploading lifecycle', function() {

        let client = new TorrentSpyClient()

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

            assert.isOk(client.addTorrent.calledWith(fixture.infoHash,
                                                        fixture.savePath,
                                                        true, // addAsPaused,
                                                        false, // addAsPaused
                                                        fixture.metadata))

            assert.equal(Torrent.compositeState(client), 'Loading.AddingToSession')

        })

        it('adding to session',  function() {

            Torrent.queuedHandle(client, 'added')

            assert.equal(Torrent.compositeState(client),'Loading.WaitingForMetadata')
        })

        it('metadata ready', function() {

            Torrent.queuedHandle(client, 'metadataReady')

            assert.equal(Torrent.compositeState(client), 'Loading.CheckingPartialDownload')
        })

        it('checking finished', function() {

            client.setLibtorrentInteractionToBlockedUploading.reset()

            Torrent.queuedHandle(client, 'checkFinished', false) // isFullyDownloaded == false

            assert.isOk(client.setLibtorrentInteractionToBlockedUploading.calledOnce)
            assert.equal(Torrent.compositeState(client), 'Loading.BlockingLibtorrentUploading')
        })

        it('libtorrent uploading blocked', function () {

            client.goToBuyMode.reset()

            Torrent.queuedHandle(client, 'blocked')

            assert.equal(client.goToBuyMode.callCount, 1)
            assert.deepEqual(client.goToBuyMode.getCall(0).args[0], fixture.extensionSettings.buyerTerms)
            assert.equal(Torrent.compositeState(client), 'Loading.GoingToMode')

        })

        it('went to buy mode', function () {

            client.loaded.reset()

            Torrent.queuedHandle(client, 'wentToBuyMode')

            assert.equal(client.loaded.callCount, 1)
            assert.equal(client.loaded.getCall(0).args[0], fixture.deepInitialState)
            assert.equal(Torrent.compositeState(client), 'Active.DownloadIncomplete.Unpaid.Stopped')

        })

        it('start', function () {

            client.startLibtorrentTorrent.reset()

            Torrent.queuedHandle(client, 'start')

            assert.isOk(client.startLibtorrentTorrent.calledOnce)
            assert.equal(Torrent.compositeState(client), 'Active.DownloadIncomplete.Unpaid.StartingLibtorrentTorrent')

            ///

            client.startExtension.reset()

            Torrent.queuedHandle(client, 'startedLibtorrentTorrent')

            assert.isOk(client.startExtension.calledOnce)
            assert.equal(Torrent.compositeState(client), 'Active.DownloadIncomplete.Unpaid.StartingExtension')

            ///

            Torrent.queuedHandle(client, 'startedExtension')

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

            ///

            client.goToObserveMode.reset()

            Torrent.queuedHandle(client, 'downloadFinished')

            assert.isOk(client.goToObserveMode.calledOnce)
            assert.equal(Torrent.compositeState(client), 'Active.FinishedDownloading.GoingToPassive')

            ///

            Torrent.queuedHandle(client, 'startedObserveMode')
            assert.equal(Torrent.compositeState(client), 'Active.FinishedDownloading.Passive')
        })

    })

    describe('Direct to passive flow', function() {

        let client = new TorrentSpyClient()

        it('gets to passive', function () {

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
            Torrent.queuedHandle(client, 'wentToObserveMode')

            // Reset all client spies from the above events
            client.resetSpies()

            Torrent.queuedHandle(client, 'startedExtension')

            assert.equal(Torrent.compositeState(client), 'Active.FinishedDownloading.Passive')
        })

    })

    describe('Direct to uploading flow', function () {

        let client = new TorrentSpyClient()

        let fixture = {
            changeSellerTerms : {
                sellerTerms : {

                }
            }
        }
        
        it('gets to (stopped) uploading', function () {

            Torrent.queuedHandle(client, 'startLoading',
                'info_hash',
                'save-path',
                null,
                null,
                DeepInitialState.UPLOADING.STOPPED,
                { sellerTerms : {}})

            Torrent.queuedHandle(client, 'added')
            Torrent.queuedHandle(client, 'metadataReady')
            Torrent.queuedHandle(client, 'checkFinished', true) // isFullyDownloaded
            Torrent.queuedHandle(client, 'blocked')
            Torrent.queuedHandle(client, 'wentToSellMode')

            // Reset all client spies from the above events
            client.resetSpies()
            Torrent.queuedHandle(client, 'startedExtension')

            assert.equal(Torrent.compositeState(client), 'Active.FinishedDownloading.Uploading.Stopped')
        })

        it('starts', function () {

            ///

            Torrent.queuedHandle(client, 'start')

            assert.isOk(client.startLibtorrentTorrent.calledOnce)
            assert.equal(Torrent.compositeState(client), 'Active.FinishedDownloading.Uploading.StartingLibtorrentTorrent')

            ///

            Torrent.queuedHandle(client, 'startedLibtorrentTorrent')

            assert.isOk(client.startExtension.calledOnce)
            assert.equal(Torrent.compositeState(client), 'Active.FinishedDownloading.Uploading.StartingExtension')

            ///

            Torrent.queuedHandle(client, 'startedExtension')
            assert.equal(Torrent.compositeState(client), 'Active.FinishedDownloading.Uploading.Started')
        })

        it('changes seller terms', function () {

            ///

            Torrent.queuedHandle(client, 'changeSellerTerms', fixture.changeSellerTerms.sellerTerms)

            assert.equal(client.changeSellerTerms.callCount, 1)
            assert.deepEqual(client.changeSellerTerms.getCall(0).args[0], fixture.changeSellerTerms.sellerTerms)
            assert.equal(Torrent.compositeState(client), 'Active.FinishedDownloading.Uploading.ChangingSellerTerms')

            ///

            Torrent.queuedHandle(client, 'changedSellerTerms')

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

            assert.equal(client.changeSellerTerms.callCount, 1)
            assert.deepEqual(client.changeSellerTerms.getCall(0).args[0], fixture.changeSellerTerms.sellerTerms)
            assert.equal(Torrent.compositeState(client), 'Active.FinishedDownloading.Uploading.GoingToObserveMode')

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

function TorrentSpyClient() {

    this.peers = {}
    this.addTorrent = sinon.spy()
    this.stopExtension = sinon.spy()
    this.startExtension = sinon.spy()
    this.startLibtorrentTorrent = sinon.spy()
    this.generateResumeData = sinon.spy()
    this.terminated = sinon.spy()
    this.setLibtorrentInteractionToBlockedUploading = sinon.spy()
    this.goToObserveMode = sinon.spy()
    this.goToSellMode = sinon.spy()
    this.goToBuyMode = sinon.spy()
    this.provideBuyerTerms = sinon.spy()
    this.loaded = sinon.spy()
    this.startUploading = sinon.spy()
    this.changeSellerTerms = sinon.spy()
    //this.downloadFinished  = sinon.spy()
    //this.getPeer: function(peerId) {},
    this.updatePeerPluginStatus = sinon.spy()
    this.addPeer = sinon.spy()
    this.removePeer = sinon.spy()
}

TorrentSpyClient.prototype.resetSpies = function() {

    this.addTorrent.reset()
    this.stopExtension.reset()
    this.startExtension.reset()
    this.startLibtorrentTorrent.reset()
    this.generateResumeData.reset()
    this.terminated.reset()
    this.setLibtorrentInteractionToBlockedUploading.reset()
    this.goToObserveMode.reset()
    this.goToSellMode.reset()
    this.goToBuyMode.reset()
    this.provideBuyerTerms.reset()
    this.loaded.reset()
    //this.downloadFinished  = sinon.spy()
    this.startUploading.reset()
    this.changeSellerTerms.reset()
    //this.getPeer: function(peerId) {},
    this.updatePeerPluginStatus.reset()
    this.addPeer.reset()
    this.removePeer.reset()

    // these are all stubs??
}

TorrentSpyClient.prototype.peerExits = function(peerId) {
    return this.peers.peerId != undefined
}

TorrentSpyClient.prototype.allPeerIds = function () {

    // iterate this.peers
    
}

TorrentSpyClient.prototype.updatePeerPluginStatus = function (peerId, status) {
    //
}

TorrentSpyClient.prototype.addPeer = function (peerId, status) {
    
}

TorrentSpyClient.prototype.removePeer = function (peerId) {
    
}

/**
TorrentSpyClient.prototype.handleInputs = function(events, resetSpiesBeforeLast) {

    if(resetSpiesBeforeLast === undefined)
        resetSpiesBeforeLast = true

    if(events.length == 0)
        return

    // Remove last event from sequence
    let lastEvent = events.pop()

    // Submit whatever remains of sequence
    SubmitEventSequenceToBasemachine(Torrent, this, events)

    // Reset all spies if told to
    if(resetSpiesBeforeLast)
        this.resetSpies()

    SubmitEventToBasemachine(Torrent, this, lastEvent)

}
 */

function fixtureToStartLoadingInput(fix) {

    return [
        'startLoading',
        fix.infoHash,
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
