/**
 * Created by bedeho on 21/07/17.
 */

var sinon = require('sinon')
var EventEmitter = require('events').EventEmitter
var util = require('util')
var TorrentState = require('joystream-node').TorrentState

///

function MockTorrentStore() {
    this.setMetadata = sinon.spy()
    this.setPeers = sinon.spy()
    this.setSuitableSellers = sinon.spy()
    this.setTorrentFiles = sinon.spy()
    this.setSellerPrice = sinon.spy()
}

/// MockTorrent

util.inherits(MockTorrent, EventEmitter)

function MockTorrent(fixture) {
    if (!fixture) {
      throw new Error('MockTorrent with undefined fixture')
    }

    EventEmitter.call(this);

    this._fixture = fixture

    this.handle = new MockTorrentHandle(fixture)
    this.startUploading = sinon.spy()

    // Setup spies?/ stubs?
}

/// HandleSpy

function MockTorrentHandle(fixture) {
    this._fixture = fixture
    this._status = new MockTorrentStatus(fixture)
}

MockTorrentHandle.prototype.status = function () {
    return this._status
}

MockTorrentHandle.prototype.torrentFile = function () {
  return new MockTorrentInfo(this._fixture)
}

MockTorrentHandle.prototype.pause = function () {
  
}

/// MockTorrentStatus

function MockTorrentStatus(fixture) {
    this._fixture = fixture
    if (fixture) {
      this.state = fixture.isFullyDownloaded ? TorrentState.seeding : TorrentState.downloading
    }
}

/// MockTorrentInfo

function MockTorrentInfo(fixture) {
    this._fixture = fixture
}

MockTorrentInfo.prototype.isValid = function() {
    return this._fixture.metadata != null
}

MockTorrentInfo.prototype.files = function () {
  return new MockFileStorage(this._fixture)
}

/// MockFileStorage
function MockFileStorage(fixture) {

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

function MakeConnectionStatus(pid, innerState, payor, payee, announcedModeAndTermsFromPeer) {

    return {
        pid : pid,
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
