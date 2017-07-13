/**
 * Created by bedeho on 13/06/17.
 */

var BaseMachine = require('../../../../BaseMachine')
var Uploading = require('./Uploading')

var FinishedDownloading = new BaseMachine({

    initialState: "Uninitialized",

    states: {

        Uninitialized : {},

        GoingToPassive : {

            toObserveModeResult : function(client, err) {

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

            toSellModeResult : function (client) {
                this.transition(client, 'Uploading')
            }
        },

        Uploading : {
            _child : Uploading
        }

    }
})

module.exports = FinishedDownloading