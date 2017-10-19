/**
 * Created by bedeho on 13/09/17.
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'

function getStyles() {

    return {
        root : {
            position: 'relative',
            top: '14px',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: '40px'
        }
    }
}

const Toolbar = (props) => {

    let styles = getStyles(props)

    return (
        <div style={styles.root}>
            {props.children}
        </div>
    )
}

export default Toolbar