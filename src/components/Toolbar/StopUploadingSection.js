/**
 * Created by bedeho on 19/08/17.
 */

import React from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'

import ButtonSection from './ButtonSection'

const StopUploadingSection = observer((props) => {

    // Derive ButtonSection props
    let className = "stop-sell"

    let onClick = () => { props.torrent.endUploading() }
    let tooltip = "Stop paid uploading"

    return (
        <ButtonSection className={className} tooltip={tooltip} onClick={onClick} />
    )
})

StopUploadingSection.propTypes = {
    torrent : PropTypes.object.isRequired, // TorrentStore really
}

export default StopUploadingSection