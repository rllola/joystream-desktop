/**
 * Created by bedeho on 13/06/17.
 */

import machina from 'machina'
import {go, refreshPeers} from '../utils'

import Loading from './Loading'
import Active from './Active'

var Torrent = machina.BehavioralFsm.extend({

    initialize: function (options) {

        // Allocate sub machines
        options.states.Loading._child = new Loading({parent_machine : this})
        options.states.Active._child = new Active({parent_machine : this})
    },

    initialState: "WaitingToLoad",

    states: {

        WaitingToLoad :  {

            startLoading : function (client, infoHash, savePath, resumeData, metadata, deepInitialState, {buyerTerms, sellerTerms}) {

                // Check that compatibility in deepInitialState and {buyerTerms, sellerTerms},
                // and store terms on client
                if(isDownloading(deepInitialState)) {

                    if(buyerTerms)
                        client._buyerTerms = buyerTerms
                    else
                        throw Error('DownloadIncomplete state requires buyer terms')

                } else if(isUploading(deepInitialState)) {

                    if(sellerTerms)
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
            _child : null,
            terminate : handleTermination
        },

        Active : {
            _child : null,
            terminate: handleTermination,

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

                    this.transition(client, 'Terminated')

                    // Tell user that we have terminated, and how to recover
                    client.terminated({
                        startState : client._startState,
                        terms : client._terms,
                    })
                }
            }
        },

        GeneratingResumeData : {

            generated : function (client, resumeData) {

                this.transition(client, 'Terminated')

                // Tell user that we have terminated, and how to recover
                client.terminated({
                    startState : client._startState,
                    terms : client._terms,
                    resumeData : resumeData
                })
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

    getDeepInitialState: function (client) {

        // figure out what state (StartingSate)
        var path = this.compositeState(client).split('.')

        return this.states[path[1]].getDeepInitialState(client)
    }
})

var handleTermination = function (client, {generateResumeData}) {

    // perhaps move this handing into lower level states?

    /**

    // Hold on to state to get back to when starting
    client._startState = this.getDeepInitialState(client)

    if(generateResumeData)
        client._generateResumeData = generateResumeData

    this.transition(client, 'StoppingExtension')

    // Tell user its time to stop the extension
    client.stopExtension()
     */
}

export default Torrent