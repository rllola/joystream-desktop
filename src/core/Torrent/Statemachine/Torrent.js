/**
 * Created by bedeho on 13/06/17.
 */

var BaseMachine = require('../../BaseMachine')
var Loading = require('./Loading/Loading')
var Active = require('./Active')
var Common = require('./Common')

var Torrent = new BaseMachine({

    initialState: "WaitingToLoad",

    states: {

        WaitingToLoad :  {

            startLoading : function (client, infoHash, name, savePath, resumeData, metadata, deepInitialState, extensionSettings) {

                // Check that compatibility in deepInitialState and {buyerTerms, sellerTerms},
                // and store terms on client
                if(Common.isDownloading(deepInitialState)) {

                    if(extensionSettings.buyerTerms)
                        client.buyerTerms = extensionSettings.buyerTerms
                    else
                        throw new Error('DownloadIncomplete state requires buyer terms')

                } else if(Common.isUploading(deepInitialState)) {

                    if(extensionSettings.sellerTerms)
                        client.sellerTerms = extensionSettings.sellerTerms
                    else
                        throw new Error('Uploading state requires seller terms')

                }

                // Store state information about loadingg
                client.infoHash = infoHash
                client.name = name
                client.savePath = savePath
                client.resumeData = resumeData
                client.metadata = metadata
                client.deepInitialState = deepInitialState

                // Whether torrent should be added in (libtorrent) paused mode from the get go
                var addAsPaused = Common.isStopped(deepInitialState)

                // Automanagement: We never want this, as our state machine should explicitly control
                // pause/resume behaviour torrents for now.
                //
                // Whether libtorrent is responsible for determining whether it should be started or queued.
                // Queuing is a mechanism to automatically pause and resume torrents based on certain criteria.
                // The criteria depends on the overall state the torrent is in (checking, downloading or seeding).
                var autoManaged = false

                // Tell user to add torrent to session
                client.addTorrent(infoHash, name, savePath, addAsPaused, autoManaged, metadata, resumeData)

                // Go to loading state
                this.transition(client, 'Loading')
            }
        },

        Loading : {

            _child : Loading,

            terminate : function(client) {

                // - We ignore resume data generation, given
                // that we ar still loading.
                // - We also do not need to stop the extension, as
                // it has not yet been started

                this.transition(client, 'Terminated')
            }
        },

        Active : {

            _child : Active,

            terminate: function(client, generateResumeData) {

                // Determine and keep what state to start in when we start next time,
                // and hold on to state to get back to when starting
                client.deepInitialState = deepInitialStateFromActiveState(this.compositeState(client))

                // Sloppy stops, may already be stopped, depending on the
                // currently active substate, but we don't care.
                client.stopExtension()
                client.stopLibtorrentTorrent()

                if(generateResumeData && client.hasOutstandingResumeData()) {

                    client.generateResumeData()

                    this.transition(client, 'GeneratingResumeData')

                } else {

                    this.transition(client, 'Terminated')
                }
            },

            processPeerPluginStatuses: function (client, statuses) {
                Common.processPeerPluginStatuses(client, statuses)
            },
        },

        GeneratingResumeData : {

            resumeDataGenerated : function (client, resumeData) {

                client.resumeData = resumeData

                this.transition(client, 'Terminated')
            },

            resumeDataGenerationFailed: function (client, error_code) {

                client.resumeData = null

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

// NB: Do recursive version later, when we figure out how
// do to proper navigation
function deepInitialStateFromActiveState(stateString) {

    var states = stateString.split('.')

    var assertMsg = "unexpected machine structure"

    // states[0] == 'Active'

    if(states[1] == 'DownloadIncomplete') {

        if(states[2] == "Unpaid") {

            if(states[3] == "Started")
                return Common.DeepInitialState.DOWNLOADING.UNPAID.STARTED
            else if(states[3] == "Stopped")
                return Common.DeepInitialState.DOWNLOADING.UNPAID.STOPPED
            else
                assert(false, assertMsg)

        } else if(states[2] == "Paid") {

            if(states[3] == "Started")
                return Common.DeepInitialState.DOWNLOADING.PAID.STARTED
            else if(states[3] == "Stopped")
                return Common.DeepInitialState.DOWNLOADING.PAID.STOPPED
            else
                assert(false, assertMsg)

        } else
            assert(false, assertMsg)

    } else if(states[1] == "FinishedDownloading") {

        if(states[2] == "Passive")
            return Common.DeepInitialState.PASSIVE
        else if(states[2] == "Uploading") {

            if(states[3] == "Started")
                return Common.DeepInitialState.UPLOADING.STARTED
            else if(states[3] == "Stopped")
                return Common.DeepInitialState.UPLOADING.STOPPED
            else
                assert(false, assertMsg)

        } else
            assert(false, assertMsg)

    } else
        assert(false, assertMsg)

}

module.exports = Torrent