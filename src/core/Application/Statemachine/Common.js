/**
 * Created by bedeho on 12/08/17.
 */

function getStandardbuyerTerms() {
    return {
        maxPrice: 1,
        maxLock: 5,
        minNumberOfSellers: 1,
        maxContractFeePerKb: 2000
    }
}

export {getStandardbuyerTerms}