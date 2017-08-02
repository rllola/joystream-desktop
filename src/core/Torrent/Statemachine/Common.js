/**
 * Created by bedeho on 14/07/17.
 */

var Peer = require('../../Peer')

function processPeerPluginStatuses(client, statuses) {

    /**
     * Poor way of doing peer list maintenance, but
     * this is all we have without proper/reliable peer level events.
     */

    if(!client.peers)
        client.peers = {}

    // Peer Ids for peers we are getting status snapshot for
    var peerIdExits = {}

    // Tell client to either add new peer
    // based on status, or tell about new status
    // if it already exits
    for(var i in statuses) {
        var s = statuses[i]
        var peer = client.peers[s.pid]

        if(peer) {
            // Update status
            peer.newStatus(s)

        } else {
            // Create client
            client.peers[s.pid] = new Peer(s.pid, client.torrent, s, client._privateKeyGenerator, client._publicKeyHashGenerator)
        }

        // Mark as present
        peerIdExits[s.pid] = true
    }

    // Iterate old peer Ids and drop the ones whichpid
    // are not part of this new snapshot

    for(var pid in client.peers) {

        if(!peerIdExits[pid])
            delete client.peers[pid]
    }

    // Update peer list
    client.store.setPeers(client.peers)
}

var DeepInitialState = {
    UPLOADING : {
        STARTED : 1,
        STOPPED : 2,
    },
    PASSIVE : 3,
    DOWNLOADING : {
        UNPAID : {
            STARTED : 4,
            STOPPED : 5,
        }
        /**
        PAID : {
          STARTED : 6,
          STOPPED : 7,
        }
        **/
    }
}

function isUploading(s) {
    return s == DeepInitialState.UPLOADING.STARTED ||
        s == DeepInitialState.UPLOADING.STOPPED

}

function isPassive(s) {
    return s == DeepInitialState.PASSIVE
}

function isDownloading(s) {
    return s == DeepInitialState.DOWNLOADING.UNPAID.STARTED ||
        s == DeepInitialState.DOWNLOADING.UNPAID.STOPPED
}

function isStopped(s) {

    return s == DeepInitialState.UPLOADING.STOPPED ||
        s == DeepInitialState.DOWNLOADING.UNPAID.STOPPED
}

module.exports.processPeerPluginStatuses = processPeerPluginStatuses
module.exports.DeepInitialState = DeepInitialState
module.exports.isUploading = isUploading
module.exports.isPassive = isPassive
module.exports.isDownloading = isDownloading
module.exports.isStopped = isStopped
