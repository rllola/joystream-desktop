/**
 * Created by bedeho on 13/06/17.
 */

var machina = require('machina')

var Uploading = require('./Uploading')

var FinishedDownloading = new machina.BehavioralFsm({

    initialState: "Uninitialized",

    states: {

        Uninitialized : {},

        GoingToPassive : {

            startedObserveMode : function(client) {

                this.transition(client, 'Passive')
            }

        },

        Passive : {
            
            startPaidUploading : function (client, sellerTerms) {

                client.goToSellMode(sellerTerms)

                this.transition(client, 'GoingToSellMode')
            }
            
        },

        GoingToSellMode : {
            
            startedSellMode : function (client) {
                this.transition(client, 'Uploading')
            }
        },

        Uploading : {
            _child : Uploading
        }

    }
})

module.exports.FinishedDownloading = FinishedDownloading