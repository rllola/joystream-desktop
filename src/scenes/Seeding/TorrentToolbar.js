/**
 * Created by bedeho on 05/05/17.
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import isRequiredIf from 'react-proptype-conditional-require'

import Toolbar, {
    OpenFolderSection,
    PlaySection,
    RemoveAndDeleteSection,
    RemoveSection,
    StopUploadingSection} from '../../components/Toolbar'

const TorrentToolbar = (props) => {
    return (
        <Toolbar>
            <PlaySection torrent={props.torrent} />
            <StopUploadingSection torrent={props.torrent}/>
            <RemoveSection torrent={props.torrent}/>
            <RemoveAndDeleteSection torrent={props.torrent}/>
            <OpenFolderSection torrent={props.torrent} />
        </Toolbar>
    )
}

TorrentToolbar.propTypes = {
    torrent : PropTypes.object.isRequired
}

export default TorrentToolbar
