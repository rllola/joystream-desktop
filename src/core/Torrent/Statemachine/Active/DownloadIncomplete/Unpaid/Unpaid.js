/**
 * Created by bedeho on 13/06/17.
 */

var BaseMachine = require('../../../../../BaseMachine')
var Started = require('./Started')

var Unpaid = new BaseMachine({

    initialState: "Uninitialized",

    states: {

        Uninitialized : {},

        Started : {

            _child : Started,

            stop : function(client) {
                client.stopExtension()
                client.stopLibTorrentTorrent()
                this.transition(client, 'Stopped')
            },
            
            changeBuyerTerms : function (client, buyerTerms) {

                client.buyerTerms = buyerTerms
                client.changeBuyerTerms(buyerTerms)
            }
        },

        Stopped : {

            start : function (client) {
                client.startLibtorrentTorrent()
                client.startExtension()
                this.go(client, 'Started/CannotStartPaidDownload')
            }

        }

    }
})

module.exports = Unpaid