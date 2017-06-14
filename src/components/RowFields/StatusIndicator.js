import React from 'react'
import PropTypes from 'prop-types'

const StatusIndicator = (props) => {

    if(props.paused)
        return <span className="label paused-label">paused</span>
    else
        return<span className="label inactive-label">started</span>
}

StatusIndicator.propTypes = {
    paused : PropTypes.bool.isRequired
}

export default StatusIndicator
