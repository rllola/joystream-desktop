/**
 * Created by bedeho on 15/05/17.
 */

/**
 * Most compact Bitcoin unit string for given representation
 *
 * Comment: yes, this is quite hacky, but couldn´ find
 * a suitable thing for it, replace in the future.
 *
 * @param quantity
 * @param units
 */
function compactBitcoinUnitString (quantity, units) {

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
}