/**
 * Created by bedeho on 30/06/17.
 */

var BaseMachine = require('../../../../../BaseMachine')
var Common = require('../../../Common')
var ConnectionInnerState = require('joystream-node').ConnectionInnerState
var commitmentToOutput = require('joystream-node').paymentChannel.commitmentToOutput

var Started = new BaseMachine({

    initialState: "Uninitialized",

    states: {

        Uninitialized: {},

        ReadyForStartPaidDownloadAttempt : {

            _onEnter : function(client) {

                // We reset suitable sellers set, since
                // we have not been handling `processPeerPluginsStatuses`
                // by calling filterSuitableSellers in an any other state.
                client.store.setSuitableSellers(null)
                client.suitableSellers = null

            },

            stop : function(client) {

                client.stopExtension()
                client.stopLibTorrentTorrent()

                this.go(client, '../Stopped')
            },

            updateBuyerTerms : function (client, buyerTerms) {

                client.buyerTerms = buyerTerms
                client.updateBuyerTerms(buyerTerms)
            },

            processPeerPluginStatuses: function(client, statuses) {
                // Update peer list
                Common.processPeerPluginStatuses(client, statuses)

                // Figure out if there are suitable sellers in sufficient amount
                let suitableSellers = filterSuitableSellers(statuses, client.buyerTerms.minNumberOfSellers)

                // Update store
                client.store.setSuitableSellers(suitableSellers)

                // and store on client
                client.suitableSellers = suitableSellers
            },

            startPaidDownload : function (client, peerComparer) {

                // Check that we can actually start
                if(!client.suitableSellers)
                    return

                // Sort suitable sellers using `peerComparer` function
                var sortedSellers = client.suitableSellers.sellers.sort(peerComparer)

                // Pick actual sellers to use
                var pickedSellers = sortedSellers.slice(0, client.buyerTerms.minNumberOfSellers)

                // Iterate sellers to
                // 1) Allocate value
                // 2) Find correct contract fee
                // 3) Construct contract output
                var downloadInfoMap = new Map()
                var contractOutputs = []
                var contractFeeRate = 0
                var index = 0

                for (var i in pickedSellers) {

                    var status = pickedSellers[i]

                    var sellerTerms = status.connection.announcedModeAndTermsFromPeer.seller.terms

                    // Pick how much to distribute among the sellers
                    var minimumRevenue = sellerTerms.minPrice * client.metadata.numPieces()

                    // Set value to at least surpass dust
                    var value = Math.max(minimumRevenue, 0)

                    // Update fee estimate
                    if(sellerTerms.minContractFeePerKb > contractFeeRate)
                        contractFeeRate = sellerTerms.minContractFeePerKb

                    // Generate keys for buyer side of contract
                    var buyerContractSk = client.getContractPrivateKey()
                    var buyerFinalPkHash = client.getPublicKeyHash()

                    // Add entry for seller in download information map
                    downloadInfoMap.set(status.pid, {
                        index: index,
                        value: value,
                        sellerTerms: sellerTerms,
                        buyerContractSk: Buffer.from(buyerContractSk),
                        buyerFinalPkHash: Buffer.from(buyerFinalPkHash)
                    })

                    // Add contract output for seller
                    contractOutputs[index] = commitmentToOutput({
                        value: value,
                        locktime: sellerTerms.minLock, //in time units (multiples of 512s)
                        payorSk: Buffer.from(buyerContractSk),
                        payeePk: Buffer.from(status.connection.payor.sellerContractPk)
                    })

                    index++
                }

                // Store download information for making actual start downloading
                // request to client later after signing
                client.downloadInfoMap = downloadInfoMap

                // Request construction and financing of the contract transaction
                client.makeSignedContract(contractOutputs, contractFeeRate)

                this.transition(client, 'SigningContract')
            }

        },

        SigningContract : {

            // NB: We don't handle input `processPeerPluginsStatuses`

            makeSignedContractResult(client, err, tx) {

                if(err) {

                    // Notify user about failure
                    client.contractSigningFailed(err)

                    this.transition(client, 'ReadyForStartPaidDownloadAttempt')

                } else {

                    client.startDownloading(tx, client.downloadInfoMap)

                    this.transition(client, 'InitiatingPaidDownload')

                }

            }

        },

        InitiatingPaidDownload : {

            // NB: We don't handleSequence peer plugin statuses

            paidDownloadInitiationCompleted : function (client, err, res) {

                if (err) {

                    // Tell user about failure
                    client.paidDownloadInitiationFailed(err)

                    this.transition(client, 'ReadyForStartPaidDownloadAttempt')

                } else {
                    this.go(client, '../../Paid/Started')
                }

            }
        }

    }

})

function filterSuitableSellers(statuses, minimumNumber) {

    var sellers = []

    for(var i in statuses) {

        var s = statuses[i]

        // Check that connection with peer is in the right state,
        // which also implies that terms are compatible
        if(s.connection && s.connection.innerState === ConnectionInnerState.PreparingContract)
            sellers.push(s)
    }

    if(sellers.length < minimumNumber)
        return null
    else {

        var estimate = 0

        return {
            sellers: sellers,
            estimate: estimate
        }
    }
}

module.exports = Started
