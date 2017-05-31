import React, { Component } from 'react'
//import {Link} from 'react-router-dom'
import PropTypes from 'prop-types'

import {getCompactBitcoinUnitString, AbsolutePositionChildren} from '../../common'

const Button = (props) => {

    return (
        <div className={"button" + (props.isActive ? " button-active" : "")} onClick={props.onClick}>
            { props.label }
            {
                /**
                props.counter
                ?
                    <AbsolutePositionChildren left={10} top={-30}>
                        <div style={{
                                        backgroundColor: props.counter.color,
                                        color: 'white',
                                        padding: 2,
                                        fontSize: 15,
                                        borderRadius: 5,
                                        paddingLeft: 5,
                                        paddingRight: 5
                                    }}>
                            {props.counter.count}
                        </div>
                    </AbsolutePositionChildren>
                :
                null
                 **/
            }
        </div>
    )
}

Button.propTypes = {

    // Button label
    label : PropTypes.string.isRequired,

    // Whether button is active or not
    isActive: PropTypes.bool.isRequired,

    // Called when button is clicked
    onClick : PropTypes.func.isRequired

    /**
    // Counter
    counter : PropTypes.shape({
        count : PropTypes.number.isRequired,
        color : PropTypes.string.isRequired
    })
     */
}

Button.defaultProps = {
    //counter : null,
    isActive : false
}

const Header = (props) => {

    return (
        <header className="header">

            <img className="logo" src="assets/img/logo-contrast.svg"/>

            <nav>
                {props.children}
            </nav>

            <div className="flex-spacer"></div>

            <div className="balance">
                <span id="label">balance</span>
                <span id="quantity"> {props.balance} B</span>
            </div>

        </header>
    )
}

Header.propTypes = {
    balance : PropTypes.number.isRequired
}

export {Button}
export default Header