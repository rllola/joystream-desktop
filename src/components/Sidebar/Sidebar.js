/**
 * Created by bedeho on 20/08/17.
 */

import React from 'react'
import PropTypes from 'prop-types'

function getStyle(props, context) {

    var style = {
        root : props.style || {},
        child : {
            marginBottom: '30px'
        }
    }

    return style
}

const Sidebar = (props) => {

    var style = props.style ? props.style : {
        display : 'flex',
        flexDirection: 'column',
        backgroundColor : props.backgroundColor
    }

    let childStyle = { marginBottom: '30px'}

    // skip last margin??

    return (
        <div style={style}>
            {props.children.map((child, index) => {
                return (
                    <div style={childStyle} key={index}>
                        {child}
                    </div>
                )
            })}
        </div>
    )
}

Sidebar.propTypes = {
    backgroundColor : PropTypes.string,
    style : PropTypes.object
}

export default Sidebar