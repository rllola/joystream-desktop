/**
 * Created by bedeho on 18/05/17.
 */

import React from 'react'
import PropTypes from 'prop-types'
import ReactTooltip from 'react-tooltip'

import Section from './Section'

const ButtonSection = (props) => {

    return (
        <Section onClick={props.onClick}>

                <div className={"button " + (props.buttonClass ? props.buttonClass : "")}></div>
            <ReactTooltip title={props.tooltip} position='top'/>
        </Section>
    )

}

ButtonSection.propTypes = {
    onClick : PropTypes.func,
    tooltip : PropTypes.string,
    buttonClass : PropTypes.string
}

export default ButtonSection