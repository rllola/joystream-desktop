/**
 * Created by bedeho on 20/08/17.
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import SvgIcon from 'material-ui/SvgIcon'
import {blue500, red500, greenA200} from 'material-ui/styles/colors'

function getStyles(props, state) {

    /**
    selected
    normalColor : PropType.string,
    hoverColor : PropType.string,
    selectedColor : PropType.string
    */

    var styles

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
                marginBottom: '20px',
                alignItems: 'center',

            },

            icon : {
                height: '30px',
                width: '30px',
                marginBottom: '20px',
                backgroundColor : state.hover ? 'red' : 'blue'
            },

            title : {
                display : props.title ? 'block' : 'none',
                color: 'black',
                fontSize: '12px',
                padding: '2px',
                paddingLeft: '8px',
                paddingRight: '8px',
                borderRadius: '100px',
                backgroundColor : state.hover ? 'red' : 'blue',
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
            <div style={style.root} className={this.props.className}
                 onMouseEnter={this.handleMouseEnter}
                 onMouseLeave={this.handleMouseLeave}
                 onClick={this.props.onClick}>
                <SvgIcon color={blue500} hoverColor={red500}>
                    <path d="M17,16c-2.951,0-5.403-0.639-7-1.712c0,0.746,0,1.238,0,1.712c0,1.657,3.134,3,7,3s7-1.343,7-3 c0-0.474,0-0.966,0-1.712C22.403,15.361,19.951,16,17,16z"></path>

                    <path  d="M17,21c-2.951,0-5.403-0.639-7-1.712c0,0.746,0,1.238,0,1.712c0,1.657,3.134,3,7,3s7-1.343,7-3 c0-0.474,0-0.966,0-1.712C22.403,20.361,19.951,21,17,21z"></path>

                    <ellipse  cx="17" cy="11" rx="7" ry="3"></ellipse>
                    <ellipse data-color="color-2"  cx="7" cy="3" rx="7" ry="3">
                    </ellipse>

                    <path data-color="color-2"  d="M8,17.973C7.673,17.989,7.341,18,7,18c-2.951,0-5.403-0.639-7-1.712C0,17.034,0,17.526,0,18 c0,1.657,3.134,3,7,3c0.34,0,0.673-0.014,1-0.034V17.973z"></path>

                    <path data-color="color-2"  d="M8,12.973C7.673,12.989,7.341,13,7,13c-2.951,0-5.403-0.639-7-1.712C0,12.034,0,12.526,0,13 c0,1.657,3.134,3,7,3c0.34,0,0.673-0.014,1-0.034V12.973z"></path>

                    <path data-color="color-2"  d="M9.92,7.766C9.018,7.916,8.042,8,7,8C4.049,8,1.597,7.361,0,6.288C0,7.034,0,7.526,0,8 c0,1.657,3.134,3,7,3c0.341,0,0.674-0.014,1.003-0.034C8.015,9.703,8.71,8.606,9.92,7.766z"></path>
                </SvgIcon>
                <div style={style.icon}></div>
                <span style={style.title}>{this.props.title}</span>
            </div>
        )

    }
 }

Button.propTypes = {
    disabled : PropTypes.bool,
    selected : PropTypes.bool,
    title : PropTypes.string.isRequired,
    className : PropTypes.string,
    iconUrl : PropTypes.string.isRequired,
    onClick : PropTypes.func.isRequired,
    alertCount : PropTypes.number,
    totalCount : PropTypes.number,
    normalColor : PropTypes.string,
    hoverColor : PropTypes.string,
    selectedColor : PropTypes.string
}

export default Button