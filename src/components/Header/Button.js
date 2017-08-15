/**
 * Created by bedeho on 15/08/17.
 */

import React, { Component } from 'react'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'

const Button = observer((props) => {

    return (
        <div className={"button" + (props.isActive ? " button-active" : "")} onClick={props.onClick}>
            { props.label }
            { props.value ? "/" + props.value : null}
            { props.notificationCount && props.notificationCount > 0 ? "/" + props.notificationCount : null}
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
})

Button.propTypes = {

    // Button label
    label : PropTypes.string.isRequired,

    // Whether button is active or not
    isActive: PropTypes.bool.isRequired,

    // Called when button is clicked
    onClick : PropTypes.func.isRequired,

    value : PropTypes.number.isRequired,

    notificationCount : PropTypes.number

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

export default Button