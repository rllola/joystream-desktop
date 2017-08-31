/**
 * Created by bedeho on 18/08/17.
 */

import React from 'react'
import PropTypes from 'prop-types'
import {Field} from './../Table'
import bytes from 'bytes'

const BytesField = (props) => {

    return (
        <Field>
            {bytes(props.bytes, {
                unitSeparator : ' ',
                decimalPlaces : props.decimalPlaces
            })}
        </Field>
    )
}

BytesField.propTypes = {
    bytes : PropTypes.number.isRequired,
    decimalPlaces : PropTypes.number
}

BytesField.defaultProps = {
    decimalPlaces : 0
}

export default BytesField