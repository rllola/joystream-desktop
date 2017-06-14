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

        waiting_for_checking: {

            fullyDownloaded: function (client) {

                if(client.startState() == StartState.UPLOADING) {

                    emit uploadingStateIncompatibleWithPartialDownload()

                    this.transition('NeedBuyerTerms')

                } else if(client.startState() == StartState.PASSIVE) {

                    emit passiveStateIncompatibleWithPartialDownload()

                    this.transition('NeedBuyerTerms')

                } else if(client.startState() == StartState.DOWNLOADING) {

                    client.toBuyMode()

                    this.transition('StartingAsDownloading')
                }

            },

            incompletelyDownloaded: function (client) {

                if(client.startState() == StartState.UPLOADING) {

                    emit uploadingStateIncompatibleWithPartialDownload()

                    this.transition('NeedBuyerTerms')

                } else if(client.startState() == StartState.PASSIVE) {

                    emit passiveStateIncompatibleWithPartialDownload()

                    this.transition('NeedBuyerTerms')

                } else if(client.startState() == StartState.DOWNLOADING) {

                    client.toBuyMode()

                    this.transition('StartingAsDownloading')

                }

            }
        },

        NeedBuyerTerms : {

        },

        StartingAsDownloading : {

            EnteredBuyMode : function (client) {

                client.start_extension(function (err, res) {

                    if(err);

                    this.handle(client, 'StartedExtension')

                })

            },

            StartedExtension : function (client) {

                emit Loaded()

                if(client.paused) {
                    this.transition('Active.Downloading.Unpaid.Started')
                } else {
                    this.transition('Active.Downloading.Unpaid.Stopped')
                }

            }


        },

        StartingAsPassive : {

        },

        StartingAsUploading : {

        }
    }

})

export default Loading