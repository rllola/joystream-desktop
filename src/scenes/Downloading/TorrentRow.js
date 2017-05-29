/**
 * Created by bedeho on 23/05/17.
 */

import React, { Component } from 'react'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'

import {Field, Row} from  '../../components/Table'
import TorrentToolbar from './TorrentToolbar'

import LinearProgress from 'material-ui/LinearProgress'
import bytes from 'bytes'
import humanizeDuration from 'humanize-duration'

import AbsolutePositionChildren from '../../components/Utils/AbsolutePositionChildren'

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

        //this.state = toolbarVisibilityState(false)
    }

    /**
    showToolbar() {
        this.setState(toolbarVisibilityState(true))
    }

    hideToolbar() {
        this.setState(toolbarVisibilityState(false))
    }

    isToolbarVisible() {
        return this.state.toolbarVisible
    }

    onMouseEnter(e) {

        console.log("onMouseEnter")

        if(this.props.canChangeToolbarVisibility) {

            // assert that !this.isToolbarVisible()

            this.showToolbar()
        }
    }

    onMouseLeave(e) {

        console.log("onMouseLeave")

        if(this.props.canChangeToolbarVisibility) {

            // assert that !this.isToolbarVisible()

            this.hideToolbar()
        }
    }
    */

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