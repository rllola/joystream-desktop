/**
 * Created by bedeho on 18/08/17.
 */

import React from 'react'
import PropTypes from 'prop-types'
import {Field} from './../Table'
import LinearProgress from 'material-ui/LinearProgress'

const ProgressIndicator = (props) => {

    let style = {
        height : '15px',
        borderRadius: 10000,
        backgroundColor : 'rgba(84, 187, 135, 0.5)'
    }

    return <LinearProgress color="#54bb87"
                           style={style}
                           mode="determinate"
                           value={props.progress}
    />
}

ProgressIndicator.propTypes = {
    progress : PropTypes.number.isRequired
}

const ProgressField = (props) => {

    return (
        <Field>
            <ProgressIndicator progress={props.progress}/>
        </Field>
    )
}

ProgressField.propTypes = {
    progress : PropTypes.number.isRequired
}

export default ProgressField