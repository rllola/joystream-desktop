/**
 * Created by bedeho on 20/09/17.
 */

import React from 'react'
import PropTypes from 'prop-types'
import SimpleLabel from  './SimpleLabel'

import {convenientBytes} from '../../common'

function getStyles(props) {

    return {
        value : {
            fontWeight : 'bold',
            marginRight : '3px'
        },
        unit : {

        }
    }

}

const BandwidthLabel = (props) => {

    let styles = getStyles(props)

    let representation = convenientBytes(props.bytesPerSecond)

    let value = (
        <div style={styles.root}>
            <span style={styles.value}>{representation.value}</span>
            <span style={styles.unit}>{representation.unit ? representation.unit + '/s' : null}</span>
        </div>
    )

    return (
        <SimpleLabel labelNode={props.labelText}
                     valueNode={value}
                     valueFieldWidth="90px"
                     {...props}
        />
    )

}

BandwidthLabel.propTypes = {
    labelText : PropTypes.string.isRequired,
    bytesPerSecond : PropTypes.number.isRequired,
    backgroundColorLeft : PropTypes.string.isRequired,
    backgroundColorRight : PropTypes.string.isRequired
}

export default BandwidthLabel