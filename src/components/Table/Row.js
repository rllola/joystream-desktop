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

/**
Row.propTypes = {
    onMouseEnter : PropTypes.func.isRequired,
    onMouseLeave : PropTypes.func.isRequired
}
*/

export default Row