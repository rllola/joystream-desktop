/**
 * Created by bedeho on 02/10/17.
 */

import React, {Component} from 'react'
import PropTypes from 'prop-types'

const ButtonLightingLevels = {
    normal : '60%',
    hover : '50%',
    pressed : '40%'
}

const BottomBorderWidth = {
    normal : '3px',
    pressed : '2px'
}

function getButtonFaceLighting(buttonState) {

    if(buttonState.pressed)
        return ButtonLightingLevels.pressed
    else if(buttonState.hover)
        return ButtonLightingLevels.hover
    else
        return ButtonLightingLevels.normal
}

function getBottomBorderWidth(buttonState) {

    if(buttonState.pressed)
        return BottomBorderWidth.pressed
    else
        return BottomBorderWidth.normal
}

function getStyles(props, state) {

    let hsColorPart = props.hue + ',' + props.saturation + '%'
    let backgroundColor = 'hsl(' + hsColorPart + ', ' + getButtonFaceLighting(state) + ')'
    let borderBottomWidth = getBottomBorderWidth(state)

    let style = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height : 'none',
        borderRadius : '15px',
        border : 'none',
        borderBottom : borderBottomWidth + ' solid hsl(' + hsColorPart + ', 20%)',
        backgroundColor : backgroundColor,
        fontFamily: 'Arial',
        fontWeight: 'bold',
        fontSize: '28px',
        color: 'white',
        padding : '16px',
        paddingLeft : '30px',
        paddingRight : '30px',
    }

    //merge style with props.style

    return {

        root : style
    }
}

class ElevatedAutoLitButton extends Component {

    constructor(props) {
        super(props)

        this.state = {
            hover : false,
            pressed : false
        }
    }

    handleMouseEnter = (e) => {
        this.setState({hover : true})
    }

    handleMouseLeave = (e) => {
        this.setState({hover : false})
    }

    handleMouseDown = (e) => {
        this.setState({pressed : true})
    }

    handleMouseUp = (e) => {
        this.setState({pressed : false})
    }

    render () {

        let styles = getStyles(this.props, this.state)

        return (
            <button style={styles.root}
                    onClick={this.props.onClick}
                    onMouseEnter={this.handleMouseEnter}
                    onMouseLeave={this.handleMouseLeave}
                    onMouseDown={this.handleMouseDown}
                    onMouseUp={this.handleMouseUp}>
                {this.props.title}
                {this.props.children}
            </button>
        )

    }
}

ElevatedAutoLitButton.propTypes = {
    title : PropTypes.string.isRequired,
    onClick : PropTypes.func.isRequired,
    hue: PropTypes.number.isRequired,
    saturation: PropTypes.number.isRequired,
    style : PropTypes.object
}

ElevatedAutoLitButton.defaultProps = {
    hue: 0,
    saturation:0,
}

export default ElevatedAutoLitButton