/**
 * Created by bedeho on 05/05/17.
 */

import React, { Component } from 'react'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'

import Table from '../../components/Table'
import {Field, Row} from  '../../components/Table'

import TorrentToolbar from './TorrentToolbar'
import TorrentContextMenu from '../../scenes/Downloading/TorrentContextMenu'

import LinearProgress from 'material-ui/LinearProgress'
import Chip from 'material-ui/Chip'

import bytes from 'bytes'
import humanizeDuration from 'humanize-duration'

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
        throw Error('bytes: must be non-negative integer')

    if(!isNonNegativeInteger(bytes_per_second))
        throw Error('bytes_per_second: must be non-negative integer')

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
        return<span className="label inactive-label">started</span>
}

StatusIndicator.propTypes = {
    paused : PropTypes.bool.isRequired
}

const ProgressIndicator = (props) => {
    return <LinearProgress color="#55C855" style={{  height : 15, borderRadius: 10000}} mode="determinate" value={props.progress} min={0} max={100}/>
}

ProgressIndicator.propTypes = {
    progress : PropTypes.number.isRequired
}

const ETAIndicator = (props) => {
    return <span>{readableETAString(props.bytes_remaining, props.bytes_per_second)}</span>
}

ETAIndicator.propTypes = {
    bytes_remaining: PropTypes.number.isRequired,
    bytes_per_second : PropTypes.number.isRequired
}

function StartDownloadingHint(props) {

    return (
        <div className="row hint-row">
            Drop a torrent file here to start download
        </div>)
}

const ToolbarContainer = (props) => {
    return (
        <div style={{position: "relative"}}>
            <span style={{ position : "absolute",  left: -132,  top: -20,}}>
                <TorrentToolbar canSpeedup={true}
                                onSpeedupClicked={() => {console.log("speedup clicked")}}
                                onOpenFolderClicked={() => {console.log("open folder clicked")}}
                                onMoreClicked={() => {console.log("more clicked")}}/>
            </span>
        </div>
    )
}

@observer
class DownloadingTorrent extends Component {

    constructor(props) {
        super(props)
    }

    componentDidMount() {

        // Start out with hidden toolbar
        this.setShowToolbar(false)
    }

    setShowToolbar(show) {
        this.setState({ showToolbar : show })
    }

    render(props) {

        // TODO
        // Remember to set all props on TorrentToolBar container to different functions or
        // fields on props.torrent ???

        return (
            <Row onMouseEnter={() => { this.setShowToolbar(true) }}
                 onMouseLeave={() => { this.setShowToolbar(false) }}>

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
                    <ETAIndicator bytes_remaining={this.props.torrent.size - this.props.torrent.downloaded_quantity} bytes_per_second={this.props.torrent.download_speed} />
                </Field>
                <Field>
                    <ModeIndicator paid={this.props.torrent.paid /** temporary **/} />
                </Field>
                { ( this.state && this.state.showToolbar ? <ToolbarContainer /> : null) }
            </Row>
        )
    }
}

DownloadingTorrent.propTypes = {
    //torrent : PropTypes.object should we here _require_ a TorrentStore?
}

const DownloadingTorrentsTable = function(props) {

    return (
        <Table column_titles={["", "State", "Size", "Progress", "Speed", "Arrival", "Mode"]}>
            { to_torrent_elements(props.torrents) }
        </Table>
    )
}

DownloadingTorrentsTable.propTypes = {
    torrents : PropTypes.array.isRequired
}

function to_torrent_elements(torrents) {

    if(torrents.length == 0)
        return <StartDownloadingHint key={0}/>
    else
        return torrents.map((t) => {
            return <DownloadingTorrent torrent={t} key={t.info_hash}/>
        })
}

export default DownloadingTorrentsTable