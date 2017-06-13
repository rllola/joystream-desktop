/**
 * Created by bedeho on 23/05/17.
 */

import React, { Component } from 'react'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'

import {Field, Row} from  '../../components/Table'
import BitcoinConvert from  '../../components/BitcoinConvert'
import TorrentToolbar from './TorrentToolbar'

import LinearProgress from 'material-ui/LinearProgress'
import bytes from 'bytes'
import humanizeDuration from 'humanize-duration'

import AbsolutePositionChildren from '../../common/AbsolutePositionChildren'

const ModeIndicator = (props) => {

    if(props.paid)
        return <span className="label paid-label">paid</span>
    else
        return<span className="label free-label">free</span>
}

ModeIndicator.propTypes = {
    paid : PropTypes.bool.isRequired
}

const StatusIndicator = (props) => {

    if(props.paused)
        return <span className="label paused-label">paused</span>
    else
        return<span className="label inactive-label">active</span>
}

StatusIndicator.propTypes = {
    paused : PropTypes.bool.isRequired
}

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
                    {bytes(this.props.torrent.upload_speed)}/s
                </Field>
                <Field>
                    <ModeIndicator paid={this.props.torrent.paid} />
                </Field>
                <Field>
                  <BitcoinConvert satoshis={this.props.torrent.price} />
                </Field>
                <Field>
                   <BitcoinConvert satoshis={this.props.torrent.revenue} />
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
