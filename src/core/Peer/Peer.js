/**
 * Created by bedeho on 13/07/17.
 */

var PeerStatemachine = require('./Statemachine')

/// Peer class

/**
 * Constructor
 * @param pid
 * @param torrent
 * @param status
 * @constructor
 */
function Peer(pid, torrent, status) {

    this._client = new PeerStatemachineClient(pid, torrent)

    this.newStatus(status)
}

Peer.prototype.newStatus = function(status) {
    PeerStatemachine.queuedHandle(this._client, 'newStatus', status)
}

/// PeerStatemachineClient class

function PeerStatemachineClient(pid, torrent) {
    this._pid = pid
    this._torrent = torrent
}

PeerStatemachineClient.prototype.generatePrivateKey = function() {
    throw new Error('missing generatePrivateKey() implementation')
}

PeerStatemachineClient.prototype.generatePublicKeyHash = function() {
    throw new Error('missing generatePublicKeyHash() implementation')
}

PeerStatemachineClient.prototype.startPaidUploading = function(buyerTerms, contractSk, finalPkHash) {

    this._torrent.startUploading(this._pid, buyerTerms, contractSk, finalPkHash, function (err) {
        PeerStatemachine.queuedHandle(this, 'startPaidUploadingResult', err)
    })
}

module.exports = Peer