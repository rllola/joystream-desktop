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
            <div data-tip data-for={props.buttonClass} className={"button " + props.buttonClass}></div>
            { props.tooltip ? <ReactTooltip id={props.buttonClass} position='top' effect='solid' className="button-section-tooltip"> {props.tooltip} </ReactTooltip> : null }
        </Section>
    )

}

ButtonSection.propTypes = {
    onClick : PropTypes.func,
    tooltip : PropTypes.string,
    buttonClass : PropTypes.string.isRequired
}

export default ButtonSection