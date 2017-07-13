/**
 * Created by bedeho on 13/06/17.
 */

var BaseMachine = require('../../BaseMachine')
var Loading = require('./Loading')
var Active = require('./Active')
var DeepInitialState = require('./DeepInitialState')
var isUploading = DeepInitialState.isUploading
//var isPassive = DeepInitialState.isPassive
var isDownloading = DeepInitialState.isDownloading
var isStopped = DeepInitialState.isStopped
var refreshPeers = require('utils').refreshPeers

var Torrent = new BaseMachine({

    initialState: "WaitingToLoad",

    states: {

        WaitingToLoad :  {

            startLoading : function (client, infoHash, name, savePath, resumeData, metadata, deepInitialState, extensionSettings) {

                // Check that compatibility in deepInitialState and {buyerTerms, sellerTerms},
                // and store terms on client
                if(isDownloading(deepInitialState)) {

                    if(extensionSettings.buyerTerms)
                        client._buyerTerms = extensionSettings.buyerTerms
                    else
                        throw new Error('DownloadIncomplete state requires buyer terms')

                } else if(isUploading(deepInitialState)) {

                    if(extensionSettings.sellerTerms)
                        client._sellerTerms = extensionSettings.sellerTerms
                    else
                        throw new Error('Uploading state requires seller terms')

                }

                // Store state information about loadingg
                client._infoHash = infoHash
                client._name = name
                client._savePath = savePath
                client._resumeData = resumeData
                client._metadata = metadata
                client._deepInitialState = deepInitialState

                // Whether torrent should be added in (libtorrent) paused mode from the get go
                var addAsPaused = isStopped(deepInitialState)

                // Automanagement: We never want this, as our state machine should explicitly control
                // pause/resume behaviour torrents for now.
                //
                // Whether libtorrent is responsible for determining whether it should be started or queued.
                // Queuing is a mechanism to automatically pause and resume torrents based on certain criteria.
                // The criteria depends on the overall state the torrent is in (checking, downloading or seeding).
                var autoManaged = false

                // Tell user to add torrent to session
                client.addTorrent(infoHash, savePath, addAsPaused, autoManaged, metadata, resumeData)

                // Go to loading state
                this.transition(client, 'Loading')
            }
        },

        Loading : {

            _child : Loading,

            terminate : function(client, generateResumeData) {

                // Make sure to remember that we may need to generate resume
                // data after stopping libtorrent & extension
                if(generateResumeData)
                    client._generateResumeData = generateResumeData

                // Tell user its time to stop the extension
                client.stopExtension()

                this.transition(client, 'StoppingExtension')
            }
        },

        Active : {

            _child : Active,

            terminate: function(client, generateResumeData) {

                // Determine what state to start in when we start next time,
                // and hold on to state to get back to when starting
                client._deepInitialState = deepInitialStateFromActiveState(this.compositeState(client))

                // Make sure to remember that we may need to generate resume
                // data after stopping libtorrent & extension
                if(generateResumeData)
                    client._generateResumeData = generateResumeData

                // Tell user its time to stop the extension
                client.stopExtension()

                this.transition(client, 'StoppingExtension')
            },

            ProcessPeerPluginStatuses: function (client, statuses) {
                refreshPeers(client, statuses)
            },
        },

        StoppingExtension : {

            stoppedExtension : function (client) {

                if(client._generateResumeData) {

                    client.generateResumeData()

                    this.transition(client, 'GeneratingResumeData')
                } else {

                    // Tell user about ending, and give exact state required to start again
                    client.terminated(terminationState(client))

                    this.transition(client, 'Terminated')
                }
            },

            // Since stopping the extension is blindly attempted,
            // we may get an error, but we just ignore it.

            alreadyStoppedError : function (client) {
                this.handle(client, 'stopped')
            }
        },

        GeneratingResumeData : {

            generatedResumeData : function (client, resumeData) {

                client._resumeData = resumeData

                // Tell user about ending, and give exact state required to start again
                client.terminated(terminationState(client))

                this.transition(client, 'Terminated')
            }
        },

        Terminated : {

            // Event drain, to prevent any further processing of events
            '*' : function (client) {
                console.log("Ignored event on state: Torrent.Terminated")
            }

        }

    }
})

function terminationState(client) {

    // Get settings for extension.
    // NB: This is a bit sloppy, as we are not handling special
    // states where terms are being changed for example, so we
    // are just picking whatever the old terms were effectively.
    var extensionSettings = {}

    if(isDownloading(client._deepInitialState))
        extensionSettings.buyerTerms = client._buyerTerms
    else if(isUploading(client._deepInitialState))
        extensionSettings.sellerTerms = client._sellerTerms

    return {
        infoHash : client._infoHash,
        savePath : client._savePath,
        resumeData: client._resumeData,
        metadata: client._metadata,
        deepInitialState: client._deepInitialState,
        extensionSettings: extensionSettings
    }

}

// NB: Do recursive version later, when we figure out how
// do to proper navigation
function deepInitialStateFromActiveState(stateString) {

    var states = stateString.split('.')

    var assertMsg = "unexpected machine structure"

    // states[0] == 'Active'

    if(states[1] == 'DownloadIncomplete') {

        if(states[2] == "Unpaid") {

            if(states[3] == "Started")
                return DeepInitialState.DOWNLOADING.UNPAID.STARTED
            else if(states[3] == "Stopped")
                return DeepInitialState.DOWNLOADING.UNPAID.STOPPED
            else
                assert(false, assertMsg)

        } else if(states[2] == "Paid") {

            if(states[3] == "Started")
                return DeepInitialState.DOWNLOADING.PAID.STARTED
            else if(states[3] == "Stopped")
                return DeepInitialState.DOWNLOADING.PAID.STOPPED
            else
                assert(false, assertMsg)

        } else
            assert(false, assertMsg)

    } else if(states[1] == "FinishedDownloading") {

        if(states[2] == "Passive")
            return DeepInitialState.PASSIVE
        else if(states[2] == "Uploading") {

            if(states[3] == "Started")
                return DeepInitialState.UPLOADING.STARTED
            else if(states[3] == "Stopped")
                return DeepInitialState.UPLOADING.STOPPED
            else
                assert(false, assertMsg)

        } else
            assert(false, assertMsg)

    } else
        assert(false, assertMsg)

}

module.exports = Torrent