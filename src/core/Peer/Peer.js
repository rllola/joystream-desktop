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
function Peer(pid, torrent, status, privateKeyGenerator, publicKeyHashGenerator) {

    this._client = new PeerStatemachineClient(pid, torrent, privateKeyGenerator, publicKeyHashGenerator)
    this.newStatus(status)
}

Peer.prototype.newStatus = function(status) {
    this._client.processStateMachineInput('newStatus', status)
}

Peer.prototype.compositeState = function() {
    return PeerStatemachine.compositeState(this._client)
}

/// PeerStatemachineClient class

function PeerStatemachineClient(pid, torrent, privateKeyGenerator, publicKeyHashGenerator) {

    this.pid = pid
    this.torrent = torrent
    this._privateKeyGenerator = privateKeyGenerator
    this._publicKeyHashGenerator = publicKeyHashGenerator
}

PeerStatemachineClient.prototype.processStateMachineInput = function (...args) {
  PeerStatemachine.queuedHandle(this, ...args)
}

PeerStatemachineClient.prototype.generateContractPrivateKey = function() {
    return this._privateKeyGenerator()
}

PeerStatemachineClient.prototype.generatePublicKeyHash = function() {
    return this._publicKeyHashGenerator()
}

module.exports = Peer
