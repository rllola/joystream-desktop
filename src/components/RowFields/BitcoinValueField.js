/**
 * Created by bedeho on 18/08/17.
 */

import React from 'react'
import PropTypes from 'prop-types'
import {Field} from './../Table'
import BitcoinConvert from  '../../components/BitcoinConvert'

const BitcoinValueField = (props) => {

    return (
        <Field>
            <BitcoinConvert satoshis={props.satoshis} />
        </Field>
    )
}

BitcoinValueField.propTypes = {
    satoshis : PropTypes.number.isRequired
}

export default BitcoinValueField