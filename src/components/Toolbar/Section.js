/**
 * Created by bedeho on 15/05/17.
 */

import React from 'react'
import PropTypes from 'prop-types'

const Section = (props) =>  {

    var classes = "section " +  (props.className ? props.className : "")

    return (
        <div className={classes} onClick={props.onClick ? props.onClick : null}>
            {props.children}
        </div>
    )
}

Section.propTypes = {
    className : PropTypes.string,
    onClick : PropTypes.func
}

export default Section