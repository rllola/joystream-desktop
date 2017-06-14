import React from 'react'
import Item from './Item'

const PauseItem = (props) => {

    var pauseStatusProps

    if(props.paused) {

        pauseStatusProps = {
            onClick : props.onChangePauseStatus,
            className : "continue-item",
            label : "Continue",
        }

    } else {

        pauseStatusProps = {
            onClick : props.onChangePauseStatus,
            className : "pause-item item-disabled",
            label : "Pause"
        }
    }

    return (
        <Item {...pauseStatusProps}/>
    )
}

export default PauseItem
