/**
 * Created by bedeho on 05/05/17.
 */

import React, { Component } from 'react'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'

import Table from '../../components/Table'
import {Field, Row} from  '../../components/Table'

import LinearProgress from 'material-ui/LinearProgress'

function StartDownloadingHint(props) {

    return (
        <div className="row hint-row">
            Drop a torrent file here to start download
        </div>)
}

@observer
class DownloadingTorrent extends Component {

    constructor(props) {
        super(props)
    }

    componentDidMount() {

        // Start out with hidden toolbar
        this.setShowToolbar(true)
    }

    setShowToolbar(show) {
        this.setState({ showToolbar : show })
    }

    render(props) {

        return (
            <Row onMouseEnter={() => { /*this.setShowToolbar(true)*/ }}
                 onMouseLeave={() => { /*this.setShowToolbar(false)*/ }}>

                <Field>
                    {this.props.torrent.name}
                </Field>
                <Field>
                    <span className="label paused-label">Paused</span>
                </Field>
                <Field>
                    {this.props.torrent.size /** later use converter **/ }
                </Field>
                <Field>
                    <LinearProgress color="#55C855" style={{  height : 15, borderRadius: 10000}} mode="determinate" value={this.props.torrent.progress} min={0} max={100}/>
                </Field>
                <Field>
                    {this.props.torrent.download_speed} Kb/s
                </Field>
                <Field>
                    {this.props.torrent.downloaded_quantity}
                </Field>
                <Field>
                    <span className="label paid-label">paid</span>

                    { ( this.state && this.state.showToolbar ? <span><h1>show toolbar</h1></span> : null) }
                </Field>
            </Row>
        )
    }
}

DownloadingTorrent.propTypes = {
    //torrent : PropTypes.object should we here _require_ a TorrentStore?
}

const DownloadingTorrentsTable = function(props) {

    return (
        <Table column_titles={["", "State", "Size", "Progress", "Speed", "ETA", "Mode"]}>
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