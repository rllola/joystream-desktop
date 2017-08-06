import React from 'react'
import PropTypes from 'prop-types'

const ModeIndicator = (props) => {
    if(props.paid) {
      return <span className="label paid-label">paid</span>
    }
    else {
      return<span className="label free-label">free</span>
    }
}

ModeIndicator.propTypes = {
    paid : PropTypes.bool.isRequired
}

export default ModeIndicator
