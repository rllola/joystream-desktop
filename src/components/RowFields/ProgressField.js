/**
 * Created by bedeho on 18/08/17.
 */

import React from 'react'
import PropTypes from 'prop-types'
import {Field} from './../Table'
import LinearProgress from 'material-ui/LinearProgress'

const ProgressIndicator = (props) => {
    return <LinearProgress color="#55C855" style={{  height : 15, borderRadius: 10000}} mode="determinate" value={props.progress} min={0} max={100}/>
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