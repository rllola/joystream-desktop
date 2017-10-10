/**
 * Created by bedeho on 17/08/17.
 */

import React from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'

import ButtonSection from './ButtonSection'

const StartPaidDownloadingSection = observer((props) => {

    // Derive ButtonSection props
    let className
    let onClick

    if(props.torrent.canStartPaidDownloading && props.store.unconfirmedBalance > 0) {
        className = "start_paid_downloading"
        onClick = () => { props.torrent.startPaidDownload() }
    } else {
        className = "start_paid_downloading-disabled"
        onClick = null
    }

    return (
        <ButtonSection className={className} tooltip="Start paid speedup" onClick={onClick} />
    )
})

StartPaidDownloadingSection.propTypes = {
    torrent : PropTypes.object.isRequired, // TorrentStore really
}

export default StartPaidDownloadingSection
