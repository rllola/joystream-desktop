/**
 * Created by bedeho on 05/05/17.
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import isRequiredIf from 'react-proptype-conditional-require'
import { inject, observer } from 'mobx-react'

import Toolbar, {Separator, ButtonSection} from '../../components/Toolbar'

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

// StartPaidDownloadingSection

const StartPaidDownloadingSection = observer((props) => {

    // Derive ButtonSection props
    let className
    let onClick

    if(props.torrent.canStartPaidDownloading) {
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

// ToggleStatus

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

// ChangeBuyerTermsSection

const ChangeBuyerTermsSection = observer((props) => {

    // Derive ButtonSection props
    let className
    let onClick
    let tooltip = "Change price"

    if(props.torrent.canChangeBuyerTerms) {
        className = "change_buyer_terms"
        onClick = () => { props.torrent.changeBuyerTerms() }
    } else {
        className = "change_buyer_terms-disabled"
        onClick = null
    }

    return (
        <ButtonSection className={className} tooltip={tooltip} onClick={onClick} />
    )
})

// RemoveSection

const RemoveSection = observer((props) => {

    // Derive ButtonSection props
    let className = "remove"
    let onClick = () => { props.torrent.remove(false) }
    let tooltip = "Remove"

    return (
        <ButtonSection className={className} tooltip={tooltip} onClick={onClick} />
    )
})

// RemoveAndDeleteSection

const RemoveAndDeleteSection = observer((props) => {

    // Derive ButtonSection props
    let className = "trash"
    let onClick = () => { props.torrent.remove(true) }
    let tooltip = "Remove & delete data"

    return (
        <ButtonSection className={className} tooltip={tooltip} onClick={onClick} />
    )
})

// OpenFolderSection

const OpenFolderSection = (props) => {

    // onClick={props.torrent.openFolder}

    return (
        <ButtonSection className={"open-folder"} tooltip="Open folder" onClick={props.onClick} />
    )
}

OpenFolderSection.propTypes = {
    torrent : PropTypes.object.isRequired, // TorrentStore really
}

// SettingsSection
// TBD

// InformationSection
// TBD

const TorrentToolbar = observer((props) => {
    return (
        <Toolbar>
            <PlaySection torrent={props.torrent} />
            <StartPaidDownloadingSection torrent={props.torrent}/>
            <ToggleStatus torrent={props.torrent}/>
            <ChangeBuyerTermsSection torrent={props.torrent}/>
            <RemoveSection torrent={props.torrent}/>
            <RemoveAndDeleteSection torrent={props.torrent}/>
            <OpenFolderSection torrent={props.torrent} />
        </Toolbar>
    )

    //<Separator />
    //<ButtonSection className="more" onClick={(e) => {props.onMoreClicked(e)}} />
})



TorrentToolbar.propTypes = {
    torrent : PropTypes.object.isRequired, // TorrentStore really
    onMoreClicked : PropTypes.func.isRequired // <==
}

export default TorrentToolbar