/**
 * Created by bedeho on 18/08/17.
 */

import React from 'react'
import PropTypes from 'prop-types'
import {Field} from './../Table'
import bytes from 'bytes'

const BytesPerSecondField = (props) => {

    var bytesPerSecondString

    if(props.bytes)
        bytesPerSecondString = bytes(props.bytes, { unitSeparator : ' '}) + '/s'

    return (
        <Field>
            {bytesPerSecondString}
        </Field>
    )

}

BytesPerSecondField.propTypes = {
    bytes : PropTypes.number.isRequired
}

export default BytesPerSecondField