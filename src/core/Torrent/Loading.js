/**
 * Created by bedeho on 13/06/17.
 */

import machina from 'machina'

const StartState = {
    UPLOADING : 0,
    PASSIVE : 1,
    DOWNLOADING : 2
}

var Loading = new machina.BehavioralFsm({

    initialize: function (options) {
        // your setup code goes here...
    },

    namespace: "Loading",

    initialState: "waiting_for_checking",

    states: {

        failed : {
          // pseudo state for when some step has failed.
        },

        waiting_for_checking: {

            fullyDownloaded: function (client) {

                if(client.desiredStartState == StartState.PASSIVE || client.desiredStartState == StartState.DOWNLOADING) {

                    // When there is a full download, and the user doesnt want to upload, then
                    // we just go to passive, even if the user really wanted to download.

                    client.toObserveMode()

                    client.actualStartState = StartState.PASSIVE

                } else { // UPLOADING

                    // When there is a full download, and the user does want to upload, then
                    // we do that
                    client.toSellMode()

                    client.actualStartState = StartState.UPLOADING
                }

                this.transition('GoingToMode')
            },

            incompletelyDownloaded: function (client) {

                // We go to buy mode, regardless of what the user wanted (client.desiredStartState),
                // user will need to supply terms on their own.
                client.toBuyMode()

                client.actualStartState = StartState.DOWNLOADING

                this.transition('GoingToMode')
            }
        },

        GoingToMode : {

            wentToBuyMode : function (client) {

                // Make sure we are supposed to go to downloading state
                if(client.actualStartState != StartState.DOWNLOADING)
                    return

                this.handle("_startExtension")
            },

            wentToSellMode : function (client) {

                // Make sure we are supposed to go to uploading state
                if(client.actualStartState != StartState.UPLOADING)
                    return

                this.handle("_startExtension")
            },

            wentToObserveMode : function (client) {

                // Make sure we are supposed to go to passive state
                if(client.actualStartState != StartState.PASSIVE)
                    return

                this.handle("_startExtension")
            },

            // Do not call this directly, only used internally by events above
            _startExtension : function(client) {

                // Start extension after now entering correct (sell) mode
                client.startExtension()

                this.transition('StartingExtension')
            }

        },

        StartingExtension : {

            started : function (client) {

                if(client.actualStartState == StartState.DOWNLOADING) {

                    if(client.paused) {

                        client.pause()
                        this.transition('Active.Downloading.Unpaid.Stopped')
                    } else {

                        client.resume()
                        this.transition('Active.Downloading.Unpaid.Started')
                    }

                } else if(client.actualStartState == StartState.UPLOADING) {

                    if(client.paused) {

                        client.pause()
                        this.transition('Active.FinishedDownloading.Uploading.Stopped')
                    } else {

                        client.resume()
                        this.transition('Active.FinishedDownloading.Uploading.Started')
                    }

                } else if(client.actualStartState == StartState.PASSIVE) {

                    client.pause()
                    this.transition('Active.FinishedDownloading.Passive')
                }
            },
        }
    },

    goToFailedState : function(client, err) {

        this.failure_cause = err
        this.transition('failed')
    }

})

export default Loading