/**
 * Created by bedeho on 13/06/17.
 */

var BaseMachine = require('../../../../BaseMachine')
var Uploading = require('./Uploading')

var FinishedDownloading = new BaseMachine({

    initialState: "Uninitialized",

    states: {

        Uninitialized : {},

        Passive : {

            goToStartedUploading : function (client) {

                // Generate standard seller terms
                let sellerTerms = client.getStandardSellerTerms()

                client.sellerTerms = sellerTerms

                client.toSellMode(sellerTerms)

                this.go(client, 'Uploading/Started')
            }

        },

        Uploading : {
            _child : Uploading
        }

    }
})

module.exports = FinishedDownloading
