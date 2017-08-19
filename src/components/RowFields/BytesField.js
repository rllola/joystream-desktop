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
            {bytes(props.bytes, { unitSeparator : ' '})}
        </Field>
    )
}

BytesField.propTypes = {
    bytes : PropTypes.number.isRequired
}

export default BytesField