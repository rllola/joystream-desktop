/**
 * Created by bedeho on 18/08/17.
 */

import React from 'react'
import PropTypes from 'prop-types'
import {Field} from './../Table'

const NameField = (props) => {

    return (
        <Field>
            {props.name}
        </Field>
    )
}

NameField.propTypes = {
    name : PropTypes.string.isRequired
}

export default NameField