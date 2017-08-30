/**
 * Created by bedeho on 18/08/17.
 */

import React from 'react'
import PropTypes from 'prop-types'
import {Field} from './../Table'
import humanizeDuration from 'humanize-duration'

/**
 * Validates non-negative integers
 * @param n
 */
function isNonNegativeInteger(n) {
    return Number.isInteger(n) && n >= 0
}

/**
 * Human readable ETA for download of given number of bytes
 * at a given rate.
 *
 * @param bytes {Number} Total number of bytes to be downloaded
 * @param bytes_per_second {Numbre} Byte rate, per second, at which bytes are downloaded
 * @param max_tokens {Number} Maximum number of tokens to be used in humanized string
 */
function readableETAString(bytes, bytes_per_second, max_tokens) {

    max_tokens = max_tokens || 2

    if(!isNonNegativeInteger(bytes))
        throw Error('bytes: must be non-negative integer')

    if(!isNonNegativeInteger(bytes_per_second))
        throw Error('bytes_per_second: must be non-negative integer')

    if(bytes_per_second == 0 || bytes == 0)
        return ""

    var total_seconds = bytes/bytes_per_second
    var total_ms = 1000 * total_seconds

    var delimiter = '-'

    // Factor out humanizer setup, instead get humanizer injected or something
    var FullHumanizedETAString = humanizeDuration(total_ms, {
        spacer: '', // String to display between each value and unit.
        delimiter: delimiter, //
        round: true,
        units: ['y', 'mo', 'w', 'd', 'h', 'm'],
        language: 'shortEn',
        languages: {
            shortEn: {
                y: function() { return 'y' },
                mo: function() { return 'mo' },
                w: function() { return 'w' },
                d: function() { return 'd' },
                h: function() { return 'h' },
                m: function() { return 'm' },
                s: function() { return 's' },
                ms: function() { return 'ms' },
            }
        }
    })

    // Trim off anything beyond second unit
    var humanizedTokens = FullHumanizedETAString.split(delimiter)

    var ETAString = ''

    for(var i = 0;i < Math.min(max_tokens, humanizedTokens.length);i++)
        ETAString += humanizedTokens[i] + ' '

    return ETAString
}

const ETAIndicator = (props) => {
    return <span>{readableETAString(props.bytes_remaining, props.bytes_per_second)}</span>
}

ETAIndicator.propTypes = {
    bytes_remaining: PropTypes.number.isRequired,
    bytes_per_second : PropTypes.number.isRequired
}

const ETAField = (props) => {

    return (
        <Field>
            <ETAIndicator bytes_remaining={props.bytes_remaining}
                          bytes_per_second={props.bytes_per_second}
            />
        </Field>
    )
}

ETAField.propTypes = {
    bytes_remaining : PropTypes.number.isRequired,
    bytes_per_second : PropTypes.number.isRequired
}

export default ETAField