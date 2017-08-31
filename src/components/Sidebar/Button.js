/**
 * Created by bedeho on 20/08/17.
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'

import SvgIcon from 'material-ui/SvgIcon'
import Badge from 'material-ui/Badge'
import {blue500, red500, greenA200} from 'material-ui/styles/colors'

function getStyles(props, state) {

    var styles

    var color

    // this is redudant in combination with selectedColor, just using
    // also perhaps the hovering? just doing color is ok?.... or have sidebar do
    // it?

    if(props.selected)
        color = props.selectedColor
    else {
        color = state.hover ? props.hoverColor : props.normalColor
    }

    if(props.className)
        styles = {
            root : null,
            icon : null,
            title : null
        }
    else
        styles = {
            root : {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            },

            icon : {
                height: '48px',
                width: '48px',
                marginBottom: '10px',
                svgIconColor : color
            },

            title : {
                display : props.title ? 'block' : 'none',
                color: props.textColor,
                fontSize: '12px',
                padding: '0px',
                paddingLeft: '8px',
                paddingRight: '8px',
                borderRadius: '100px',
                backgroundColor : 'none', //props.selected ? props.selectedColor : 'none',
                cursor: 'default' // block selection cursor
            }
        }

    return styles
}

class Button extends Component {

    constructor(props) {
        super(props)

        this.state = {hover : false}
    }

    handleMouseEnter = () => {
        this.setState({hover : true})
    }

    handleMouseLeave = () => {
        this.setState({hover : false})
    }

    render() {

        var style = getStyles(this.props, this.state)

        return (
            <div style={style.root}
                 onMouseEnter={this.handleMouseEnter}
                 onMouseLeave={this.handleMouseLeave}
                 onClick={this.props.onClick}>

                    <SvgIcon color={style.icon.svgIconColor} style={style.icon} viewBox={this.props.viewBox}>
                        {this.props.children}
                    </SvgIcon>


                <span style={style.title}>{this.props.title}</span>
            </div>
        )

    }
 }

Button.propTypes = {
    disabled : PropTypes.bool,
    selected : PropTypes.bool,
    title : PropTypes.string.isRequired,
    onClick : PropTypes.func.isRequired,

    alertCount : PropTypes.number,
    totalCount : PropTypes.number,

    normalColor : PropTypes.string.isRequired,
    hoverColor : PropTypes.string.isRequired,
    selectedColor : PropTypes.string.isRequired,

    textColor : PropTypes.string.isRequired,

    viewBox : PropTypes.string
}

Button.defaultProps = {
    disabled : false,
    selected : false,
    onClick : () => {},

    normalColor : '#4E7296',
    hoverColor : '#4A90E2',
    selectedColor : 'white',

    textColor : '#202F53'
}


export default Button