/**
 * Created by bedeho on 11/07/17.
 */

//import Torrent as TorrentStatemachine from './St'
import Torrent from './Statemachine'
var TorrentStatemachine = require('./Statemachine').Torrent

function Torrent(session, store) {

    this._session = session
    this._store = store
    this._client = new TorrentStatemachineClient()

    // NB: WE HAVE TO TRACK ALL TRANSITION ON ALL MACHINES, BECAUSE MACHINA.JS IS SLOPPY.
    TorrentStatemachine.on('transition', function(data) {

        let stateString = TorrentStatemachine.compositeState(this._client)
        
        // We guard update to avoid costly mobx-write
        if(this._store.getState() != stateString)
            this._store.setState(stateString)
        
    })

    // Add relay handlers to protype for all user inputs
    let userInputNames = ['startLoading', 'terminate', 'metadataReady', 'checkFinished']

    for(var i = 0 in userInputNames) {

        let name = userInputNames[i]

        Torrent.prototype[name] = function() {

            // unroll

            TorrentStatemachine.queuedHandle(this, name, unroll)
        }
    }

}

/// TorrentStatemachineClient

function TorrentStatemachineClient(session, store) {
    this._session = session
    this._store = store
}

TorrentStatemachineClient.prototype.addTorrent = function (infoHash, savePath, addAsPaused, autoManaged, metadata) {

    // Construct params for libtorrent
    // NB: only reason we are doing this here, and not inside
    // machine is
    let addTorrentParams = {} // ...

    // Add to libtorrent session, and tell self about result when ready
    this._session.addTorrent(addTorrentParams, (err, torrent) => {
        TorrentStatemachine.queuedHandle(this, 'addTorrentResult', err, torrent)
    })
}

TorrentStatemachineClient.prototype.stopExtension = function () {

    this._session.plugin(function (res, err) {
        TorrentStatemachine.queuedHandle(this, 'stopExtensionResult', res, err)
    })
}

TorrentStatemachineClient.prototype.startExtension = function () {

}

TorrentStatemachineClient.prototype.startLibtorrentTorrent = function () {

}

TorrentStatemachineClient.prototype.generateResumeData = function () {

}

TorrentStatemachineClient.prototype.terminated = function () {

}

TorrentStatemachineClient.prototype.setLibtorrentInteractionToBlockedUploading = function() {

    this._session.plugin(function() {
        TorrentStatemachine.queuedHandle(this, 'blocked', res, err)
    })
}

TorrentStatemachineClient.prototype.goToObserveMode = function () {

}

TorrentStatemachineClient.prototype.goToSellMode = function () {

}

TorrentStatemachineClient.prototype.goToBuyMode = function () {

}

TorrentStatemachineClient.prototype.provideBuyerTerms = function () {

}

TorrentStatemachineClient.prototype.changeSellerTerms = function () {

}

TorrentStatemachineClient.prototype.startUploading = function () {

}

module.exports = Torrent