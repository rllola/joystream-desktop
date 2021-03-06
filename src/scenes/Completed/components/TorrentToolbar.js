import React, { Component } from 'react'
import PropTypes from 'prop-types'
import isRequiredIf from 'react-proptype-conditional-require'

import Toolbar, {
    OpenFolderSection,
    PlaySection,
    RemoveAndDeleteSection,
    RemoveSection,
    StartUploadingSection} from '../../../components/Toolbar'

const TorrentToolbar = (props) => {
    return (
        <Toolbar>
            <PlaySection torrent={props.torrent} />
            <StartUploadingSection torrent={props.torrent}/>
            <RemoveSection torrent={props.torrent} store={props.store} />
            <RemoveAndDeleteSection torrent={props.torrent} store={props.store} />
            <OpenFolderSection torrent={props.torrent} />
        </Toolbar>
    )
}

TorrentToolbar.propTypes = {
    torrent : PropTypes.object.isRequired,
    store : PropTypes.object.isRequired
}

export default TorrentToolbar
