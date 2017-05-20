
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import isRequiredIf from 'react-proptype-conditional-require'
import Toolbar, {Separator, ButtonSection} from '../../components/Toolbar'

const TorrentToolbar = (props) => {

    return (
        <Toolbar>
            { props.canSpeedup ? <ButtonSection buttonClass="speedup" tooltip="Start paid speedup" onClick={props.onSpeedupClicked} /> : null }
            <ButtonSection buttonClass="open-folder" tooltip="Open folder" onClick={props.onOpenFolderClicked} />
            <Separator />
            <ButtonSection buttonClass="more" onClick={props.onMoreClicked} />
        </Toolbar>
    )
}

TorrentToolbar.propTypes = {
    canSpeedup : PropTypes.bool.isRequired,
    onSpeedupClicked: isRequiredIf(PropTypes.func, props => props.canSpeedup, 'onSpeedupClicked is required if canSpeedup is true'),
    onOpenFolderClicked : PropTypes.func.isRequired,
    onMoreClicked : PropTypes.func.isRequired
}

export default TorrentToolbar