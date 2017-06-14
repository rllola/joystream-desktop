/**
 * Created by bedeho on 23/05/17.
 */

import React, { Component } from 'react'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'

import { Field, Row } from  '../../components/Table'
import { StatusIndicator, ProgressIndicator, ETAIndicator, ModeIndicator } from '../../components/RowFields'
import TorrentToolbar from './TorrentToolbar'
import bytes from 'bytes'

import AbsolutePositionChildren from '../../common/AbsolutePositionChildren'

///

function toolbarVisibilityState(visible) {
    return {toolbarVisible : visible}
}

var ToolbarVisibilityType = {
    OnHover : 0,
    Hidden : 1,
    Visible : 2
}

//@observer
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

                <Field>
                    {this.props.torrent.name}
                </Field>
                <Field>
                    <StatusIndicator paused={this.props.torrent.paused} />
                </Field>
                <Field>
                    {bytes(this.props.torrent.size)}
                </Field>
                <Field>
                    <ProgressIndicator progress={this.props.torrent.progress}/>
                </Field>
                <Field>
                    {bytes(this.props.torrent.download_speed)}/s
                </Field>
                <Field>
                    <ETAIndicator bytes_remaining={this.props.torrent.size - this.props.torrent.downloaded_quantity}
                                  bytes_per_second={this.props.torrent.download_speed} />
                </Field>
                <Field>
                    <ModeIndicator paid={this.props.torrent.paid} />
                </Field>

                { this.getRenderedToolbar() }
            </Row>
        )
    }

    getRenderedToolbar() {

        return (
            this.props.toolbarVisibilityStatus != ToolbarVisibilityType.Hidden
            ?
            <AbsolutePositionChildren left={-132} top={-20}>
                <TorrentToolbar {...this.props.toolbarProps}/>
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

export {ToolbarVisibilityType}
export default TorrentRow
