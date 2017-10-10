/**
 * Created by bedeho on 05/05/17.
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import isRequiredIf from 'react-proptype-conditional-require'
import { inject, observer } from 'mobx-react'

import Toolbar, {
    ChangeBuyerTermsSection,
    OpenFolderSection,
    PlaySection,
    RemoveAndDeleteSection,
    RemoveSection,
    StartPaidDownloadingSection,
    ToggleStatusSection} from '../../components/Toolbar'

const TorrentToolbar = observer((props) => {
    return (
        <Toolbar>
            <PlaySection torrent={props.torrent} />
            <StartPaidDownloadingSection torrent={props.torrent} store={props.store}/>
            <ToggleStatusSection torrent={props.torrent}/>
            {/** <ChangeBuyerTermsSection torrent={props.torrent}/> **/}
            <RemoveSection torrent={props.torrent} store={props.store}/>
            <RemoveAndDeleteSection torrent={props.torrent} store={props.store}/>
            <OpenFolderSection torrent={props.torrent} />
        </Toolbar>
    )

    //<Separator />
    //<ButtonSection className="more" onClick={(e) => {props.onMoreClicked(e)}} />
})



TorrentToolbar.propTypes = {
    torrent : PropTypes.object.isRequired, // TorrentStore really
    store : PropTypes.object.isRequired,
    onMoreClicked : PropTypes.func.isRequired // <==
}

export default TorrentToolbar
