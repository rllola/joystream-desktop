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

import ToolbarVisibilityType, { toolbarVisibilityState } from '../../utils/ToolbarVisibilityState'

/**
 * Validates non-negative integers
 * @param n
 */
function isNonNegativeInteger(n) {
    return Number.isInteger(n) && n >= 0
}

/**
 * Human readable ETA for download of given number of bytes
 * at a given rate.
 *
 * @param bytes {Number} Total number of bytes to be downloaded
 * @param bytes_per_second {Numbre} Byte rate, per second, at which bytes are downloaded
 */
function readableETAString(bytes, bytes_per_second) {

    if(!isNonNegativeInteger(bytes))
        throw Error('bytes: must be non-negative integer, found: ' + bytes)

    if(!isNonNegativeInteger(bytes_per_second))
        throw Error('bytes_per_second: must be non-negative integer, found: ' + bytes)

    if(bytes_per_second == 0 || bytes == 0)
        return ""

    var total_seconds = bytes/bytes_per_second
    var total_ms = 1000 * total_seconds

    // Factor out humanizer setup, instead get humanizer injected or something
    var ETAString = humanizeDuration(total_ms, {
        round: true,
        units: ['y', 'mo', 'w', 'd', 'h', 'm'],
        language: 'shortEn',
        languages: {
            shortEn: {
                y: function() { return 'y' },
                mo: function() { return 'mo' },
                w: function() { return 'w' },
                d: function() { return 'd' },
                h: function() { return 'h' },
                m: function() { return 'm' },
                s: function() { return 's' },
                ms: function() { return 'ms' },
            }
        }
    })

    return ETAString
}

const NameField = (props) => {

    return (
        <Field>
            {props.name}
        </Field>
    )
}

NameField.propTypes = {
    name : PropTypes.string.isRequired
}

const StatusField = (props) => {

    return (
        <Field>
            <StatusIndicator paused={props.paused} />
        </Field>
    )
}

StatusField.propTypes = {
    paused : PropTypes.bool.isRequired
}

const BytesField = (props) => {

    return (
        <Field>
            {bytes(props.bytes, { unitSeparator : ' '})}
        </Field>
    )
}

BytesField.propTypes = {
    bytes : PropTypes.number.isRequired
}

const ProgressField = (props) => {

    return (
        <Field>
            <ProgressIndicator progress={props.progress}/>
        </Field>
    )
}

ProgressField.propTypes = {
    progress : PropTypes.number.isRequired
}

const BytesPerSecondField = (props) => {

    var bytesPerSecondString

    if(props.bytes)
        bytesPerSecondString = bytes(props.bytes, { unitSeparator : ' '}) + '/s'

    return (
        <Field>
            {bytesPerSecondString}
        </Field>
    )

}

BytesPerSecondField.propTypes = {
    bytes : PropTypes.number.isRequired
}

const ETAField = (props) => {

    return (
        <Field>
            <ETAIndicator bytes_remaining={props.bytes_remaining}
                          bytes_per_second={props.bytes_per_second}
            />
        </Field>
    )
}

ETAField.propTypes = {
    bytes_remaining : PropTypes.number.isRequired,
    bytes_per_second : PropTypes.number.isRequired
}

const ModeField = (props) => {

    return (
        <Field>
            <ModeIndicator paid={props.isPaid} />
        </Field>
    )
}

ModeField.propTypes = {
    isPaid : PropTypes.bool.isRequired
}

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

                <NameField name={this.props.torrent.name} />
                <StatusField paused={this.props.torrent.canStart} />
                <BytesField bytes={this.props.torrent.totalSize} />
                <ProgressField progress={this.props.torrent.progress} />
                <BytesPerSecondField bytes={this.props.torrent.downloadSpeed} />
                <ETAField bytes_remaining={this.props.torrent.totalSize - this.props.torrent.downloadedSize}
                          bytes_per_second={this.props.torrent.downloadSpeed}
                />
                <ModeField isPaid={this.props.torrent.canStartPaidDownloading} />

                { this.getRenderedToolbar() }
            </Row>
        )
    }

    getRenderedToolbar() {

        return (
            this.props.toolbarVisibilityStatus != ToolbarVisibilityType.Hidden
            ?
            <AbsolutePositionChildren left={-340} top={-20}>
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
