/**
 * Created by bedeho on 06/05/17.
 */

import React from 'react'
import PropTypes from 'prop-types'

const Row = (props) => {

    return (
        <div className="row"
             onMouseEnter={props.onMouseEnter}
             onMouseLeave={props.onMouseLeave}>
        {props.children}
        </div>
    )
}

Row.propTypes = {
    onMouseEnter : PropTypes.func,
    onMouseLeave : PropTypes.func
}

export default Row