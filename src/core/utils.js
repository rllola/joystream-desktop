/**
 * Created by bedeho on 20/06/17.
 */

// Poor way of doing peer list maintenance, but
// this is all we have without proper/reliable peer level events.
var refreshPeers = function(client, statuses) {

    // Peer Ids for peers we are getting status snapshot for
    var peerIdExits

    // Tell client to either add new peer
    // based on status, or tell about new status
    // if it already exits
    for(var i in statuses) {

        var s = statuses[i]

        if(client.peerExits(s.peerId)) {
            client.newPeerPluginStatus(s.peerId, s)
        } else {
            client.newPeer(s.peerId, s)
        }

        // Mark as present
        peerIdExits[s.peerId] = true
    }

    // Iterate old peer Ids and drop the ones which
    // are not part of this new snapshot
    var oldPeerIds = client.allPeerIds()

    for(var i in oldPeerIds) {

        var oldPeerId = oldPeerIds[i]

        if(!peerIdExits[oldPeerId])
            client.peerGone(oldPeerId)
    }
}

module.exports.refreshPeers = refreshPeers