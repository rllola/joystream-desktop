/**
 * Created by bedeho on 16/08/17.
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'

const StatusBar = (props) => {

    if(!props.show)
        return null

    let style = {
        zIndex : 100,
        display : 'fixed',
        position: 'absolute',
        width: '100%',
        backgroundColor : '#ffc521',
        borderTop : '1px solid #eab214'
    }

    if(props.bottom)
        style.bottom = '0px'
    else
        style.top = '0px'

    return (
        <div style={style}>
            {props.children}
        </div>
    )

}

StatusBar.propTypes = {
    show : PropTypes.bool.isRequired,
    bottom : PropTypes.bool.isRequired
}

export default StatusBar