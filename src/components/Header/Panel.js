/**
 * Created by bedeho on 15/08/17.
 */

import React, { Component } from 'react'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'

const Panel = observer((props) => {

    return (
        <div className="balance">
            <span id="label">{props.label}</span>
            <span id="quantity"> {props.quantity} B</span>
        </div>
    )
})

Panel.propTypes = {
    label : PropTypes.string,
    quantity : PropTypes.number
}

export default Panel