/**
 * Created by bedeho on 13/06/17.
 */

import machina from 'machina'
import {go, refreshPeers} from '../../utils'

import Loading from './Loading'
import Active from './Active'
import DeepInitialState from './DeepInitialState'

var Torrent = machina.BehavioralFsm({

    initialize: function (options) {},

    initialState: "WaitingToLoad",

    states: {

        WaitingToLoad :  {

            startLoading : function (client, infoHash, savePath, resumeData, metadata, deepInitialState, extensionSettings) {

                // Check that compatibility in deepInitialState and {buyerTerms, sellerTerms},
                // and store terms on client
                if(isDownloading(deepInitialState)) {

                    if(extensionSettings.buyerTerms)
                        client._buyerTerms = buyerTerms
                    else
                        throw Error('DownloadIncomplete state requires buyer terms')

                } else if(isUploading(deepInitialState)) {

                    if(extensionSettings.sellerTerms)
                        client._sellerTerms = sellerTerms
                    else
                        throw Error('Uploading state requires seller terms')

                }

                // Store state information about loadingg
                client._infoHash = infoHash
                client._savePath = savePath
                client._resumeData = resumeData
                client._metadata = metadata
                client._deepInitialState = deepInitialState

                // Wheter torrent should be added in paused mode from the get go
                var addAsPaused = isPaused(deepInitialState)

                // Tell user to add torrent to session
                client.addTorrent(infoHash, savePath, addAsPaused, metadata)

                // Go to loading state
                this.transition(client, 'Loading')
            }
        },

        Loading : {
            _child : Loading(),
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
            _child : Active(),
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

            stopped : function (client) {

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
            // We may get an error

            alreadyStoppedError : function (client) {
                this.handle(client, 'stopped')
            }
        },

        GeneratingResumeData : {

            generated : function (client, resumeData) {

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

    },

    go: go,

})

function terminationState(client) {

    // Get settings for extension.
    // NB: This is a bit sloppy, as we are not handling special
    // states where terms are being changed for example, so we
    // are just picking whatever the old terms were effectively.
    var extensionSettings

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

export default Torrent