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

function getStandardSellerTerms() {
    return {
        minPrice: 1,
        minLock: 5,
        maxNumberOfSellers: 1,
        minContractFeePerKb: 2000
    }
}

export {getStandardbuyerTerms, getStandardSellerTerms}