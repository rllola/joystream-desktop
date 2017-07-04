/**
 * Created by bedeho on 30/06/17.
 */

import machina from 'machina'
import {refreshPeers} from '../../../../utils'

var Started = machina.BehavioralFsm({

    initialize: function (options) {
    },

    initialState: "Uninitialized",

    states: {

        Uninitialized: {},

        CanStartPaidDownload : {

            processPeerPluginsStatuses: function(client, statuses) {

                // Update peer list
                refreshPeers(client, statuses)

                // Figure out if there are suitable sellers in sufficient amount
                client._suitableSellers = filterSuitableSellers(statuses, client._buyerTerms.minNumberOfSellers)

                // If the minimum number of suitable sellers are not present, then we switch state, otherwise, we stay
                if(!client._suitableSellers) {
                    this.transition(client, 'CannotStartPaidDownload')
                }

            },

            startPaidDownload : function (client, peerComparer) {

                // Sort suitable sellers using `peerComparer` function
                var sortedSellers = client._suitableSellers.sort(peerComparer)

                // Pick actual sellers to use
                var pickedSellers = sortedSellers.slice(0, client._buyerTerms.minNumberOfSellers)

                // Iterate sellers to
                // 1) Allocate value
                // 2) Find correct contract fee
                // 3) Construct contract output
                var downloadInfoMap = new Map()
                var contractOutputs = []
                var contractFeeRate = 0
                var index = 0

                for (var i in sortedSellers) {

                    var status = sortedSellers[i]

                    var sellerTerms = status.connection.announcedModeAndTermsFromPeer.seller.terms

                    // Pick how much to distribute among the sellers
                    var minimumRevenue = sellerTerms.minPrice * client._metadata.num_pieces()

                    // Set value to at least surpass dust
                    var value = Math.max(minimumRevenue, 0)

                    // Update fee estimate
                    if(sellerTerms.minContractFeePerKb > contractFeeRate)
                        contractFeeRate = sellerTerms.minContractFeePerKb

                    // Generate keys for buyer side of contract
                    var buyerContractSk = client.getContractPrivateKey()
                    var buyerFinalPkHash = client.getPublicKeyHash()

                    // Add entry for seller in download information map
                    downloadInfoMap.set(status.peerId, {
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
                client._downloadInfoMap = downloadInfoMap

                // Request construction and financing of the contract transaction
                client.makeSignedContract(contractOutputs, contractFeeRate)

                this.transition(client, 'SigningContract')
            }

        },

        SigningContract : {

            // NB: We don't process peer plugin statuses

            contractSigned : function (client, tx) {

                client.startDownloading(client.infoHash(), tx, client._downloadInfoMap)

                this.transition(client, 'InitiatingPaidDownload')
            },

            contractCouldNotBeSigned : function (client, err) {

                // Notify user about failure
                client.contractSigningFailed(err)

                // Safe than sorry:
                // Go back to blocked state and wait for new snapshot to be sure
                // that we can still start paid download
                this.transition(client, 'CannotStartPaidDownload')
            }

        },

        InitiatingPaidDownload : {

            // NB: We don't process peer plugin statuses

            paidDownloadInitiationCompleted : function (client, res, err) {

                if (err) {

                    // Tell user about failure
                    client.paidDownloadInitiationFailed(err)

                    // Safe than sorry:
                    // Go back to blocked state and wait for new snapshot to be sure
                    // that we can still start paid download
                    this.transition(client, 'CannotStartPaidDownload')

                } else {
                    this.go(client, ['..', '..', 'Paid', 'Started'])
                }

            }
        },

        CannotStartPaidDownload : {

            processPeerPluginsStatuses: function(client, statuses) {

                // Update peer list
                refreshPeers(client, statuses)

                // Figure out if there are suitable sellers in sufficient amount
                client._suitableSellers = filterSuitableSellers(statuses, client._buyerTerms.minNumberOfSellers)

                // If the minimum number of suitable sellers are present, then we switch state, otherwise, we stay
                if(client._suitableSellers) {
                    this.transition(client, 'CanStartPaidDownload')
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
        if(s.connection && s.connection.innerState === InnerStateTypeInfo.PreparingContract)
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