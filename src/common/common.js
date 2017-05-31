/**
 * Created by bedeho on 15/05/17.
 */


const BitcoinUnit = {
    BTC : 0,
    mBTC : 1,
    uBTC : 2,
    Satoshi : 3
}

class BitcoinQuantity {

    constructor(amount, unit) {

        // Is non-negative integer
        this.amount = amount

        this.unit = unit

    }

    // quality operator

    isEqualTo(quanitt) {

    }

    toUnit() {

    }

    toCompactUnit() {
        // compact in what sense?
    }
}

/**
 * Most compact Bitcoin unit string for given representation
 *
 * Comment: yes, this is quite hacky, but couldn´ find
 * a suitable thing for it, replace in the future.
 *
 * @param quantity
 * @param units
 */
function getCompactBitcoinUnits (quantity, units) {

    return {
        quantity : quantity,
        units : units
    }

    /**

    if(!(Number.isInteger(quantity) && quantity >= 0))
        throw Error('Quantity must be non-negative integer')

    var result = {
        number : quantity,
        units : units
    }

    supported_units = btcConvert.units()


    var length_of_shortest_representation = "" + toNumber
    for(u in supporter_units) {

        var num = btcConvert (quantity, units, u, 'Number')
        var num_as_string = "" + num

        if(num_as_string.length < length_of_shortest_representation) {

        }
    }

    // no match ?
    // throw

    return result
     */
}

function getCompactBitcoinUnitString(quantity, units) {

    // Find most compact representation
    var result = compactBitcoinUnits(quantity, units)

    // Convert to string and return
    return result.quantity + " " + result.units
}

export {getCompactBitcoinUnits, getCompactBitcoinUnitString}