/**
 * Created by bedeho on 11/07/17.
 */

var EventEmitter = require('events').EventEmitter;

var TorrentStatemachine = require('./Statemachine/Torrent')

/// Torrent class

// Make event emitter
util.inherits(Torrent, EventEmitter)

/**
 * Constructor
 * @param session
 * @constructor
 */
function Torrent(store, session) {

    EventEmitter.call(this)

    this._store = store
    this._client = new TorrentStatemachineClient(session, this._store)

    TorrentStatemachine.on('transition', function (data) {

        // Check that the transition is on this torrent
        if(data.client != this._client)
            return

        // Get current state
        let stateString = TorrentStatemachine.compositeState(this._client)

        // Updat state in store
        this._store.setState(stateString)

        // Relay events for others to consume
        this.emit('transition', data)

        // Detect functional events?
        //  - Loaded: Lots of destination events?
        //  - 'Loading.WaitingForMissingBuyerTerms'
        //  - Terminated: emit event with payload client.deepInitialState

    })

}

/**
 * Begin torrent lifetime
 * @param infoHash
 * @param name
 * @param savePath
 * @param resumeData
 * @param metadata
 * @param deepInitialState
 * @param extensionSettings
 */
Torrent.prototype.startLoading = function(infoHash, name, savePath, resumeData, metadata, deepInitialState, extensionSettings) {
    TorrentStatemachine.queuedHandle(this._client, 'startLoading', infoHash, name, savePath, resumeData, metadata, deepInitialState, extensionSettings)
}

/**
 * Terminate torrent lifetime
 * @param generateResumeData whether generating resume data is wanted. Notice that even,
 * if this is true, resume data will not be generated.
 */
Torrent.prototype.terminate = function(generateResumeData) {
    TorrentStatemachine.queuedHandle(this._client, 'terminate', generateResumeData)
}

/// TorrentStateMachineClient
/// Holds state and external messaging implementations for a (behavoural machinajs) Torrent state machine instance

function TorrentStatemachineClient(session, session) {
    this.session = session
    this.store = store
}

TorrentStatemachineClient.prototype.addTorrent = function(infoHash, name, savePath, addAsPaused, autoManaged, metadata, resumeData) {

    // Construct params for libtorrent
    // NB 1: only reason we are doing this here, and not inside
    // machine is because we dont want to break old interface just now, fix later
    // NB 2: This needs to really be factored out
    // NB 3: Ignoring `addAsPaused` and `autoManaged` until this is fixed https://github.com/JoyStream/libtorrent-node/issues/21
    let addTorrentParams = {
        infoHash : infoHash,
        savePath : savePath,
        resumeData : resumeData
    }

    if(name)
        addTorrentParams.name = name

    if(metadata)
        addTorrentParams.ti = metadata

    this.session.addTorrent(addTorrentParams, (err, torrent) => {

        LOG_ERROR(err)

        TorrentStatemachine.queuedHandle(this, 'addTorrentResult', err, torrent)
    })
}

TorrentStatemachineClient.prototype.stopExtension = function() {

    this.torrent.stopPlugin(function (err, res) {

        LOG_ERROR(err)

        // Silent
        //TorrentStatemachine.queuedHandle(this, 'stopExtensionResult', err, res)
    })

}

TorrentStatemachineClient.prototype.startExtension = function() {

    this.torrent.startPlugin(function(res, err) {

        LOG_ERROR(err)

        // Silent
        //TorrentStatemachine.queuedHandle(this, 'startExtensionResult', err, res)
    })
}

TorrentStatemachineClient.prototype.startLibtorrentTorrent = function() {

    this.torrent.handle.resume()
}

TorrentStatemachineClient.prototype.stopLibtorrentTorrent = function() {

    this.torrent.handle.pause()
}

TorrentStatemachineClient.prototype.generateResumeData = function() {

    this.torrent.handle.saveResume_data()
}

TorrentStatemachineClient.prototype.setLibtorrentInteraction = function(mode) {

    this.torrent.setLibtorrentInteraction (mode, function() {

        LOG_ERROR(err)

        // Silent
        //TorrentStatemachine.queuedHandle(this, 'setLibtorrentInteractionResult', err, res) // 'blocked'
    })
}

TorrentStatemachineClient.prototype.toObserveMode = function() {

    this.torrent.toObserveMode(function(err, res) {

        LOG_ERROR(err)

        // Silent
        // TorrentStatemachine.queuedHandle(this, 'toObserveModeResult', err, res)
    })
}

TorrentStatemachineClient.prototype.toSellMode = function(sellerTerms) {

    this.torrent.toSellMode(sellerTerms, function(err, res) {

        LOG_ERROR(err)

        // Silent
        //TorrentStatemachine.queuedHandle(this, 'toSellModeResult', err, res)
    })
}

TorrentStatemachineClient.prototype.toBuyMode = function(buyerTerms) {
    this.torrent.toBuyMode(buyerTerms, function(err, res) {

        LOG_ERROR(err)

        // Silent
        // TorrentStatemachine.queuedHandle(this, 'toBuyModeResult', err, res)
    })
}

TorrentStatemachineClient.prototype.updateSellerTerms = function() {
    console.log('not yet implemented in bindings library')

    // Make silent
}

TorrentStatemachineClient.prototype.updateBuyerTerms = function() {
    console.log('not yet implemented in bindings library')

    // Make silent
}

TorrentStatemachineClient.prototype.startUploading = function(connectionId, buyerTerms, contractSk, finalPkHash) {

    this.torrent.startUploading(connectionId, buyerTerms, contractSk, finalPkHash, function (err, res) {
        TorrentStatemachine.queuedHandle(this, 'startUploadingResult', err, res)
    })
}

TorrentStatemachineClient.prototype.makeSignedContract = function(contractOutputs, contractFeeRate) {

    console.log("not yet implemented")

}

TorrentStatemachineClient.prototype.startDownloading = function(contract, downloadInfoMap) {

    this.torrent.startDownloading(contract, downloadInfoMap, function(err, res) {

        TorrentStatemachine.queuedHandle(this, 'startDownloadingResult', err, res)
    })
}

function LOG_ERROR(err) {

    if(err)
        console.log("Error found in callback:" + err)
}

/**
 function terminationState(client) {

    // Get settings for extension.
    // NB: This is a bit sloppy, as we are not handling special
    // states where terms are being changed for example, so we
    // are just picking whatever the old terms were effectively.
    var extensionSettings = {}

    if(isDownloading(client.deepInitialState))
        extensionSettings.buyerTerms = client.buyerTerms
    else if(isUploading(client.deepInitialState))
        extensionSettings.sellerTerms = client.sellerTerms

    return {
        infoHash : client.infoHash,
        savePath : client.savePath,
        resumeData: client.resumeData,
        metadata: client.metadata,
        deepInitialState: client.deepInitialState,
        extensionSettings: extensionSettings
    }

}
 */

export default Torrent