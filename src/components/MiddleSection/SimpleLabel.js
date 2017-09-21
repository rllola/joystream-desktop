/**
 * Created by bedeho on 13/09/17.
 */

import React from 'react'
import PropTypes from 'prop-types'

import Label from './Label'

function getStyle(props) {

    return {
        icon : {

        },

        left : {
            paddingLeft: '14px',
            paddingRight: '14px',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '10px',
            textAlign: 'center'
        },

        right :  {
            width: props.valueFieldWidth,
            marginLeft: 14,
            marginRight: 14+14,
            color: 'white',
            fontSize: '14px',
            textAlign: 'center'
        }

    }
}

const SimpleLabel = (props) => {

    let style = getStyle(props)

    let leftField = (
        <div style={style.left}>
            {props.iconNode ? props.iconNode : null}
            {props.labelNode}
        </div>
    )

    let rightField = <div style={style.right}> {props.valueNode} </div>

    return (
        <Label height={30}
               leftField={leftField}
               rightField={rightField}
               backgroundColorLeft={props.backgroundColorLeft}
               backgroundColorRight={props.backgroundColorRight}
        />
    )

}

class Palette {

    constructor() {

    }
}

//SimpleLabel.Palette = Palette

SimpleLabel.propTypes = {
    iconNode : PropTypes.node,
    labelNode : PropTypes.node.isRequired,
    valueNode : PropTypes.node.isRequired,
    //titleWidth : PropTypes.string.isRequired,
    valueFieldWidth : PropTypes.string.isRequired,
    backgroundColorLeft : PropTypes.string.isRequired,
    backgroundColorRight : PropTypes.string.isRequired
}

export default SimpleLabel