/**
 * Created by bedeho on 21/07/17.
 */

var sinon = require('sinon')
var EventEmitter = require('events').EventEmitter
var util = require('util')

///

function MockTorrentStore() {
    this.setMetadata = sinon.spy()
    this.setPeers = sinon.spy()
    this.setSuitableSellers = sinon.spy()
}

/// MockTorrent

util.inherits(MockTorrent, EventEmitter)

function MockTorrent(fixture) {

    EventEmitter.call(this);

    this._fixture = fixture

    this._handle = new MockTorrentHandle(fixture)
    this.startSelling = sinon.spy()

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

/// MockTorrentInfo

function MockTorrentInfo(fixture) {
    this._fixture = fixture
}

MockTorrentInfo.prototype.isValid = function() {
    return this._fixture.metadata != null
}

/// MakePeerPluginStatus

function MakePeerPluginStatus(pid,
                              endPoint,
                              peerBEP10SupportStatus,
                              peerBitSwaprBEPSupportStatus,
                              connection) {

    return {
        pid : pid,
        endPoint : endPoint,
        peerBEP10SupportStatus : peerBEP10SupportStatus,
        peerBitSwaprBEPSupportStatus : peerBitSwaprBEPSupportStatus,
        connection : connection
    }
}

function MakeConnectionStatus(endpoint, innerState, payor, payee, announcedModeAndTermsFromPeer) {

    return {
        endpoint : endpoint,
        innerState : innerState,
        payor: payor,
        payee: payee,
        announcedModeAndTermsFromPeer : announcedModeAndTermsFromPeer
    }
}

var MakeAnnouncedModeAndTerms = {

    None : function() {

        return {
            none: true
        }

    },
    Observe : function () {

        return {
            observer : true
        }

    },
    Sell : function (terms, index) {

        return {
            seller : {
                terms : terms,
                index : index
            }
        }

    },
    Buy : function (terms) {

        return {
            buyer : {
                terms : terms
            }
        }

    }
}

module.exports.MockTorrentInfo = MockTorrentInfo
module.exports.MockTorrentStatus = MockTorrentStatus
module.exports.MockTorrentHandle = MockTorrentHandle
module.exports.MockTorrent = MockTorrent
module.exports.MockTorrentStore = MockTorrentStore
module.exports.MakePeerPluginStatus = MakePeerPluginStatus
module.exports.MakeConnectionStatus = MakeConnectionStatus
module.exports.MakeAnnouncedModeAndTerms = MakeAnnouncedModeAndTerms
