import React from 'react'
import LinearProgress from 'material-ui/LinearProgress'
import PropTypes from 'prop-types'

const ProgressIndicator = (props) => {
    return <LinearProgress color="#55C855" style={{  height : 15, borderRadius: 10000}} mode="determinate" value={props.progress} min={0} max={100}/>
}

ProgressIndicator.propTypes = {
    progress : PropTypes.number.isRequired
}

export default ProgressIndicator
