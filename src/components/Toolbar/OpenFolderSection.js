/**
 * Created by bedeho on 17/08/17.
 */

import React from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'

import ButtonSection from './ButtonSection'

const OpenFolderSection = observer((props) => {

    // onClick={props.torrent.openFolder}

    return (
        <ButtonSection className={"open-folder"} tooltip="Open folder" onClick={() => { props.torrent.openFolder()}} />
    )
})

OpenFolderSection.propTypes = {
    torrent : PropTypes.object.isRequired, // TorrentStore really
}

export default OpenFolderSection