/**
 * Created by bedeho on 18/08/17.
 */

import React from 'react'
import PropTypes from 'prop-types'
import {Field} from './../Table'

const IsUploadingField = (props) => {

    return (
        <Field>
            {
                props.uploading
                    ?
                <span className="label inactive-label">no</span>
                    :
                <span className="label paused-label">yes</span>
            }
        </Field>
    )
}

IsUploadingField.propTypes = {
    uploading : PropTypes.bool.isRequired
}

export default IsUploadingField