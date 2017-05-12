/**
 * Created by bedeho on 11/05/17.
 */

import React from 'react'
import PropTypes from 'prop-types'

/**
 * A generic context menu item component
 */
const Item = (props) => {

    return (
        <div className={"item " + (props.onClick ? "clickable-item " : null) + (props.class ? props.class : null)}
             onClick={props.onClick ? props.onClick : null}>
            <div className="icon"></div>
            <div className="body">
                {props.label ? <div className="label">{props.label}</div> : null }
                {props.description ? <div className="description"> {props.description} </div> : null }
                {props.children}
            </div>
        </div>
    )
}

Item.propTypes = {
    onClick : PropTypes.func,
    class : PropTypes.string,
    label: PropTypes.string,
    description: PropTypes.string
}

export default Item