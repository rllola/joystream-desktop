/**
 * Created by bedeho on 06/05/17.
 */

import React from 'react'
import PropTypes from 'prop-types'

const Row = (props) => {

    return (
        <div className={"row" + (props.className ? " " + props.className : "")}>
            {props.children}
        </div>
    )
}

Row.propTypes = {
    className : PropTypes.string
}

export default Row
