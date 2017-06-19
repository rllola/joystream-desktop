import React, { Component } from 'react'
import PropTypes from 'prop-types'
import isRequiredIf from 'react-proptype-conditional-require'

import Toolbar, {Separator, ButtonSection} from '../../components/Toolbar'

const TorrentToolbar = (props) => {
    return (
        <Toolbar>
            <ButtonSection className="start-sell " tooltip="Start Selling" onClick={() => {console.log('Start Selling !')}} />
            <ButtonSection className="open-folder" tooltip="Open folder" onClick={props.onOpenFolderClicked} />
            <Separator />
            <ButtonSection className="more" onClick={(e) => {props.onMoreClicked(e)}} />
        </Toolbar>
    )
}

TorrentToolbar.propTypes = {
    onOpenFolderClicked : PropTypes.func.isRequired,
    onMoreClicked : PropTypes.func.isRequired
}

export default TorrentToolbar
