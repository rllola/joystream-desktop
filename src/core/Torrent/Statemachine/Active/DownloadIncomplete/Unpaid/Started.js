/**
 * Created by bedeho on 30/06/17.
 */

var BaseMachine = require('../../../../../BaseMachine')
var Common = require('../../../Common')
var ConnectionInnerState = require('joystream-node').ConnectionInnerState
var commitmentToOutput = require('joystream-node').paymentChannel.commitmentToOutput

var StartPaidDownloadViability = require('../../../../StartPaidDownloadViability')

var Started = new BaseMachine({

    initialState: "Uninitialized",

    states: {

        Uninitialized: {},

        ReadyForStartPaidDownloadAttempt : {

            _onEnter : function(client) {

                // We reset viability,since
                // we have not been handling `processPeerPluginsStatuses`
                // by calling `computeStartPaidDownloadViability` in an any other state.
                let defaultViability = new StartPaidDownloadViability.NoJoyStreamPeerConnections()

                client.store.setStartPaidDownloadViability(defaultViability)
                client.viability = defaultViability

            },

            stop : function(client) {

                client.stopExtension()
                client.stopLibtorrentTorrent()

                this.go(client, '../Stopped')
            },

            updateBuyerTerms : function (client, buyerTerms) {

                client.buyerTerms = buyerTerms
                client.updateBuyerTerms(buyerTerms)
            },

            processSentPayment  : function (client, alert) {
              client.store.setBuyerSpent(alert.pid, alert.totalAmountPaid)
            },

            processBuyerTermsUpdated: function (client, terms) {
                client.store.setBuyerPrice(terms)
            },

            processPeerPluginStatuses: function(client, statuses) {

                // Update peer list
                Common.processPeerPluginStatuses(client, statuses)

                // Figure out if there are suitable sellers in sufficient amount
                let viability = computeStartPaidDownloadViability(statuses, client.buyerTerms.minNumberOfSellers)

                // Update store
                client.store.setStartPaidDownloadViability(viability)

                // Store on client, we have to keep around, since we dont keep status around
                client.viability = viability
            },

            startPaidDownload : function (client) {

                // Check that we can actually start
                if(!(client.viability instanceof StartPaidDownloadViability.Viable))
                    return

                let peerComparer = function (sellerA, sellerB) {
                    const termsA = sellerA.connection.announcedModeAndTermsFromPeer.seller.terms
                    const termsB = sellerB.connection.announcedModeAndTermsFromPeer.seller.terms
                    return termsA.minPrice - termsB.minPrice
                }

                // Sort suitable sellers using `peerComparer` function
                var sortedSellers = client.viability.suitableAndJoined.sort(peerComparer)

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
                    var buyerContractSk = client.generateContractPrivateKey()
                    var buyerFinalPkHash = client.generatePublicKeyHash()

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

            paidDownloadInitiationCompleted : function (client, alert) {

              // NB: Joystream alert never throw error. Need to be added in extension-cpp
                if (alert.error) {

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

function computeStartPaidDownloadViability(statuses, minimumNumber) {

    // Statuses for:

    // all JoyStream peers
    var joyStreamPeers = []

    // all JoyStream seller mode peers
    var sellerPeers = []

    // all JoyStream (seller mode peers) invited, including
    var invited = []

    // all joined sellers
    var joined = []

    // Classify our peers w.r.t. starting a paid download
    for(var i in statuses) {

        var s = statuses[i]

        // If its a joystream peer
        if(s.connection) {

            // then keep hold on to it
            joyStreamPeers.push(s)

            // If its a seller
            if(s.connection.announcedModeAndTermsFromPeer.seller) {

                // then hold on to it
                sellerPeers.push(s)

                // If seller has been invited
                if(s.connection.innerState === ConnectionInnerState.WaitingForSellerToJoin ||
                    s.connection.innerState === ConnectionInnerState.PreparingContract) {

                    // then hold on to it
                    invited.push(s)

                    // Check if seller actually joined
                    if(s.connection.innerState === ConnectionInnerState.PreparingContract)
                        joined.push(s)
                }
            }

        }

    }

    if(joyStreamPeers.length === 0)
        return new StartPaidDownloadViability.NoJoyStreamPeerConnections()
    else if(sellerPeers.length === 0)
        return new StartPaidDownloadViability.NoSellersAmongJoyStreamPeers(joyStreamPeers)
    else if(invited.length < minimumNumber)
        return new StartPaidDownloadViability.InSufficientNumberOfSellersInvited(invited)
    else if(joined.length < minimumNumber)
        return new StartPaidDownloadViability.InSufficientNumberOfSellersHaveJoined(joined, invited)
    else // NB: Later add estimate here using same peer selection logic found in startPaidDownload input above
        return new StartPaidDownloadViability.Viable(joined, 0)
}

module.exports = Started
