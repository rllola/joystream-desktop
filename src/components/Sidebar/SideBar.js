/**
 * Created by bedeho on 20/08/17.
 */

import React from 'react'
import PropTypes from 'prop-types'

const SideBar = (props) => {

    var style = {
        display : 'flex',
        flexDirection: 'column'
    }

    return (
        <div style={style}>
            {props.children}
        </div>
    )
}

SideBar.propTypes = {
    title : PropTypes.string.isRequired,
}

export default SideBar