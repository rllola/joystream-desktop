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
function Peer(pid, torrent, status, privateKeyGenerator, pubKeyHashGenerator) {

    this._client = new PeerStatemachineClient(pid, torrent, privateKeyGenerator, pubKeyHashGenerator)
    this.newStatus(status)
}

Peer.prototype.newStatus = function(status) {
    PeerStatemachine.queuedHandle(this._client, 'newStatus', status)
}

Peer.prototype.compositeState = function() {
    return PeerStatemachine.compositeState(this._client)
}

/// PeerStatemachineClient class

function PeerStatemachineClient(pid, torrent, privateKeyGenerator, pubKeyHashGenerator) {

    this.pid = pid
    this.torrent = torrent
    this._privateKeyGenerator = privateKeyGenerator
    this._pubKeyHashGenerator = pubKeyHashGenerator
}

PeerStatemachineClient.prototype.generatePrivateKey = function() {
    return this._privateKeyGenerator()
}

PeerStatemachineClient.prototype.generatePublicKeyHash = function() {
    return this._pubKeyHashGenerator()
}

module.exports = Peer