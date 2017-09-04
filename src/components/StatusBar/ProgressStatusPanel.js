/**
 * Created by bedeho on 16/08/17.
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'

import LinearProgress from 'material-ui/LinearProgress'

const ProgressStatusPanel = (props) => {

    var rootStyle = {
        padding: '15px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    }

    var contentDivStyle = {
        display: 'flex'
    }

    var titleStyle = {
        marginRight : '20px',
        fontSize : '20px',
        fontWeight : 'bold'
    }

    var progressStyle = {
        height : '8px',
        borderRadius : '100px',
        width: '400px',
        alignSelf: 'center'
    }

    return (
        <div style = {rootStyle}>
            <div style={contentDivStyle}>
                <span style={titleStyle}>
                    {props.title}
                </span>
                <div style={{display : 'flex'}}>
                    <LinearProgress mode="determinate"
                                    value={props.percentageProgress}
                                    style={progressStyle}
                                    //color='#46b980'
                    />
                </div>
            </div>
        </div>
    )
}

ProgressStatusPanel.propTypes = {
    title : PropTypes.string.isRequired,
    percentageProgress : PropTypes.number.isRequired
}

export default ProgressStatusPanel