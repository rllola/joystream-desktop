/**
 * Created by bedeho on 04/07/17.
 */

var DeepInitialState = require('../../../src/core/Torrent/Statemachine/DeepInitialState').DeepInitialState
var Torrent = require('../../../src/core/Torrent/Statemachine/Torrent').Torrent

var my_client = {

    addTorrent : function(infoHash, savePath, addAsPaused, autoManaged, metadata) {

        // session.add()

        Torrent.handle(this, 'added')

    },

    stopExtension : function() {

    },

    startExtension : function () {

    },

    startLibtorrentTorrent() {

    },

    startLibtorrentTorrent() {

    },

    generateResumeData : function () {
        
    },

    terminated : function (state) {
        
    },

    setLibtorrentInteractionToBlockedUploading : function () {

        Torrent.handle(this, 'blocked')
        
    },

    goToObserveMode : function () {

    },

    goToSellMode: function(terms) {

    },

    goToBuyMode: function (terms) {

    },

    provideBuyerTerms: function (terms) {

    },

    loaded: function(deepInitialState) {

    },

    downloadFinished: function () {

    },

    changeSellerTerms: function(sellerTerms) {

    },

    // synchronous
    allPeerIds: function() {

        //returns var peerIds
    },

    getPeer: function(peerId) {

    },

    startUploading: function (peerId, sellerTerms) {

    }

    
}

var infoHash = "my_info_hash"
var savePath = "save_path"
var resumeData = "resume_data"
var metadata = "metadta"
var deepInitialState = DeepInitialState.PASSIVE
var extensionSettings = {}

Torrent.handle(my_client, 'startLoading', infoHash, savePath, resumeData, metadata, deepInitialState, extensionSettings)

var x = 1