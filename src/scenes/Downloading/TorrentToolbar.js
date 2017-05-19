
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Toolbar, {Separator, ButtonSection} from '../../components/Toolbar'

import IconButton from 'material-ui/IconButton'

const TorrentToolbar = (props) => {

    // Render differently if props.canSpeedup is false

    return (
        <Toolbar>
            <ButtonSection buttonClass="speedup" tooltip="speedup tooltip" onClick={props.onSpeedupClicked} />
            <ButtonSection buttonClass="open-folder" tooltip="open-folder tooltip" onClick={props.onOpenFolderClicked} />
            <Separator />
            <ButtonSection buttonClass="more" tooltip="more tooltip" onClick={props.onMoreClicked} />
        </Toolbar>
    )
}

TorrentToolbar.propTypes = {
    canSpeedup : PropTypes.bool.isRequired,
    onSpeedupClicked: PropTypes.func, // is required if `canStartBuying`
    onOpenFolderClicked : PropTypes.func.isRequired,
    onMoreClicked : PropTypes.func.isRequired
}

export default TorrentToolbar