/**
 * Created by bedeho on 17/08/17.
 */

import React from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'

import ButtonSection from './ButtonSection'

const StartUploadingSection = observer((props) => {

    // Derive ButtonSection props
    let className

    let onClick
    if(props.torrent.canBeginUploading) {
        className = "start-sell"
        onClick = () => { props.torrent.beginUploading() } // terms?????
    } else {
        className = "start-sell-disabled"
        onClick = null
    }

    let tooltip = "Start paid uploading"

    return (
        <ButtonSection className={className} tooltip={tooltip} onClick={onClick} />
    )
})

StartUploadingSection.propTypes = {
    torrent : PropTypes.object.isRequired, // TorrentStore really
}

export default StartUploadingSection