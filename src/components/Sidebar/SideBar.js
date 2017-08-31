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

const SideBar = (props) => {

    var style = props.style ? props.style : {
        display : 'flex',
        flexDirection: 'column',
        backgroundColor : props.backgroundColor
    }

    let childStyle = {marginBottom: '30px'}

    // skip last margin??

    return (
        <div style={style}>
            {props.children.map(child => {
                return (
                    <div style={childStyle}>
                        {child}
                    </div>
                )
            })}
        </div>
    )
}

SideBar.propTypes = {
    backgroundColor : PropTypes.string,
    style : PropTypes.string
}

export default SideBar