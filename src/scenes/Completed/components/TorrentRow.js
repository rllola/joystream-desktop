import React, { Component } from 'react'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'

import { Field, Row } from  '../../../components/Table'
import { NameField, BytesField, IsUploading} from '../../../components/RowFields'
import TorrentToolbar from './TorrentToolbar'
import bytes from 'bytes'

import AbsolutePositionChildren from '../../../common/AbsolutePositionChildren'

import ToolbarVisibilityType from '../../../utils/ToolbarVisibilityState'

@observer
class TorrentRow extends Component {

    /**
     * Local UI state
     * ==============
     * toolbarVisible {bool} - whether the toolbar for this row is currently visible
     */

    constructor(props) {
        super(props)
    }

    render(props) {

        return (
            <Row className={this.props.toolbarVisibilityStatus == ToolbarVisibilityType.OnHover ? "row-managed-toolbar-visiblity" : ""}>

                <NameField name={this.props.torrent.name}/>
                <IsUploading uploading={this.props.torrent.canBeginUploading}/>
                <BytesField bytes={this.props.torrent.totalSize}/>

                { this.getRenderedToolbar() }
            </Row>
        )
    }

    getRenderedToolbar() {

        return (
            this.props.toolbarVisibilityStatus != ToolbarVisibilityType.Hidden
            ?
            <AbsolutePositionChildren left={-250} top={-20}>
                <TorrentToolbar {...this.props.toolbarProps} torrent={this.props.torrent}/>
            </AbsolutePositionChildren>
            :
            null
        )

    }
}

TorrentRow.propTypes = {
    torrent: PropTypes.object.isRequired, // hould we here _require_ a TorrentStore?
    toolbarVisibilityStatus : PropTypes.oneOf(Object.values(ToolbarVisibilityType)).isRequired,
    toolbarProps : PropTypes.object, // later use shape?
}

export default TorrentRow
