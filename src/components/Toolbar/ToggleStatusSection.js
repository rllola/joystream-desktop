/**
 * Created by bedeho on 17/08/17.
 */

import React from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'

import ButtonSection from './ButtonSection'

const ToggleStatus = observer((props) => {

    // Derive ButtonSection props
    let className
    let onClick
    let tooltip

    if(props.torrent.canStart) {
        className = "toggle_status-start"
        onClick = () => { props.torrent.start() }
        tooltip = "Start"
    } else if(props.torrent.canStop) {
        className = "toggle_status-stop"
        onClick = () => { props.torrent.stop() }
        tooltip = "Stop"
    } else
        return null //

    return (
        <ButtonSection className={className} tooltip={tooltip} onClick={onClick} />
    )
})

ToggleStatus.propTypes = {
    torrent : PropTypes.object.isRequired, // TorrentStore really
}

export default ToggleStatus