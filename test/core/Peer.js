/**
 * Created by bedeho on 08/07/17.
 */
var assert = require('chai').assert
var sinon = require('sinon')
var Peer = require('../../src/core/Peer')
var Mocks = require('./Mocks')

var ConnectionInnerState = require('joystream-node').ConnectionInnerState

describe('Peer state machine', function () {

    let pid = "my_peer_id"
    let endpoint = "my_endpoint"
    let peerBEP10SupportStatus = "peerBEP10SupportStatus"
    let peerBitSwaprBEPSupportStatus = "peerBitSwaprBEPSupportStatus"
    let torrent = new Mocks.MockTorrent({})
    let peer = null

    let privateKeyGenerator = sinon.stub()
    let contractSk = "this is my private key"
    privateKeyGenerator.returns(contractSk)

    let pubKeyHashGenerator = sinon.stub()
    let finalPkHash = "this is my public key hash"
    pubKeyHashGenerator.returns(finalPkHash)

    it('is properly constructed', function () {

        peer = new Peer(pid, torrent, {}, privateKeyGenerator, pubKeyHashGenerator)

        assert.equal(peer.compositeState(), "ReadyForStartPaidUploadAttempt")
    })

    it('ignores state updates in wrong mode', function () {

        let s = Mocks.MakePeerPluginStatus(pid, null, null, null,
            Mocks.MakeConnectionStatus(pid, ConnectionInnerState.ReadyForInvitation, null, null, null)
        )

        peer.newStatus(s)

        assert.equal(peer.compositeState(), "ReadyForStartPaidUploadAttempt")
        assert.equal(torrent.startSelling.callCount, 0)

    })

    let buyerTerms = { xxx : 222}

    it('updates state: tries to start paid uploading', function () {

        let s = Mocks.MakePeerPluginStatus(pid, null, null, null,
            Mocks.MakeConnectionStatus(pid, ConnectionInnerState.Invited, null, null,
                Mocks.MakeAnnouncedModeAndTerms.Buy(buyerTerms))
        )

        peer.newStatus(s)

        assert.equal(peer.compositeState(), "StartingPaidUploading")
        assert.equal(torrent.startSelling.callCount, 1)
        assert.deepEqual(torrent.startSelling.getCall(0).args[0], s.connection)
        assert.equal(torrent.startSelling.getCall(0).args[1], contractSk)
        assert.equal(torrent.startSelling.getCall(0).args[2], finalPkHash)
    })

    it('goes to paid upload start', function () {

        var startSellingCallback = torrent.startSelling.getCall(0).args[3]

        // Make callback with successful start of selling
        startSellingCallback(false)

        assert.equal(peer.compositeState(), "PaidUploadingStarted")
    })

    it('detects reset', function () {

        peer.newStatus({})

        assert.equal(peer.compositeState(), "ReadyForStartPaidUploadAttempt")

    })

})
