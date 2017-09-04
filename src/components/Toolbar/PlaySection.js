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

    if(props.torrent.playableIndexfiles.length > 0) {
        className = "play"
        // Will later let the user pick which file to play. By default it is the
        // first one.
        onClick = () => { props.torrent.play(props.torrent.playableIndexfiles[0]) }
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
