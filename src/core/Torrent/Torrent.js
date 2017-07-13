/**
 * Created by bedeho on 11/07/17.
 */

import TorrentStatemachine from './Statemachine/Torrent'

class Torrent {

    // add observables

    constructor(session) {

        this._store = new TorrentStore(this)
        this._client = new TorrentStatemachineClient(session, this._store)

        // NB: WE HAVE TO TRACK ALL TRANSITION ON ALL MACHINES, BECAUSE MACHINA.JS IS SLOPPY.
        TorrentStatemachine.on('transition', function (data) {

            // Detect functional events?

            // Loaded: Lots of destination events?

            // 'Loading.WaitingForMissingBuyerTerms'

            // Update UI store
            let stateString = TorrentStatemachine.compositeState(this._client)

            // We guard update to avoid costly mobx-write
            if (this._store.getState() != stateString)
                this._store.setState(stateString)

        })

    }

    getStore() {
        return this._store
    }

    startLoading(infoHash, name, savePath, resumeData, metadata, deepInitialState, extensionSettings) {
        TorrentStatemachine.queuedHandle(this._client, 'startLoading', infoHash, name, savePath, resumeData, metadata, deepInitialState, extensionSettings)
    }

    terminate(generateResumeData) {
        TorrentStatemachine.queuedHandle(this._client, 'terminate', generateResumeData)
    }

}

/**
 * Holds state and external messaging implementations for a (behavoural machinajs) Torrent state machine instance
 */
class TorrentStatemachineClient {
    
    constructor(session, store) {
        this._session = session
        this._store = store
    }

    addTorrent(infoHash, name, savePath, addAsPaused, autoManaged, metadata, resumeData) {

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

        this._session.addTorrent(addTorrentParams, (err, torrent) => {
            TorrentStatemachine.queuedHandle(this, 'addTorrentResult', err, torrent)
        })
    }

    stopExtension() {

        this._torrent.stopPlugin(function (err, res) {
            TorrentStatemachine.queuedHandle(this, 'stopExtensionResult', err, res)
        })
    }

    startExtension() {

        this._torrent.startPlugin(function(res, err) {
            TorrentStatemachine.queuedHandle(this, 'startExtensionResult', err, res)
        })
    }

    startLibtorrentTorrent() {

        this._torrent.handle.resume()
    }

    generateResumeData() {

        this._torrent.handle.saveResume_data()
    }

    terminated() {
        TorrentStatemachine.queuedHandle(this, 'terminated')
    }

    setLibtorrentInteraction(mode) {

        this._torrent.setLibtorrentInteraction (mode, function() {
            TorrentStatemachine.queuedHandle(this, 'setLibtorrentInteractionResult', err, res) // 'blocked'
        })
    }

    toObserveMode() {

        this._torrent.toObserveMode(function(err, res) {
            TorrentStatemachine.queuedHandle(this, 'toObserveModeResult', err, res)
        })
    }

    toSellMode(sellerTerms) {

        this._torrent.toSellMode(sellerTerms, function(err, res) {
            TorrentStatemachine.queuedHandle(this, 'toSellModeResult', err, res)
        })
    }

    toBuyMode(buyerTerms) {
        this._torrent.toBuyMode(buyerTerms, function(err, res) {
            TorrentStatemachine.queuedHandle(this, 'toBuyModeResult', err, res)
        })
    }

    updateSellerTerms() {
        console.log('not yet implemented in bindings library')
    }

    updateBuyerTerms() {
        console.log('not yet implemented in bindings library')
    }

    startUploading(connectionId, buyerTerms, contractSk, finalPkHash) {

        this._torrent.startUploading(connectionId, buyerTerms, contractSk, finalPkHash, function (err, res) {
            TorrentStatemachine.queuedHandle(this, 'startUploadingResult', err, res)
        })
    }

    startDownloading(contract, downloadInfoMap) {

        this._torrent.startDownloading(contract, downloadInfoMap, function(err, res) {
            TorrentStatemachine.queuedHandle(this, 'startDownloadingResult', err, res)
        })
    }
}

export default Torrent