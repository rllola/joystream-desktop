/**
 * Created by bedeho on 17/08/17.
 */

import React from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'

import ButtonSection from './ButtonSection'

const PlaySection = observer((props) => {

    // Derive ButtonSection props
    let className
    let onClick

    if(true) { // Do we some how guard when we can play?
        className = "play"
        onClick = () => { props.torrent.play() }
    } else {
        className = "play-disabled"
        onClick = null
    }

    return (
        <ButtonSection className={className} tooltip="Play content" onClick={onClick} />
    )
})

PlaySection.propTypes = {
    torrent : PropTypes.object.isRequired, // TorrentStore really
}

export default PlaySection