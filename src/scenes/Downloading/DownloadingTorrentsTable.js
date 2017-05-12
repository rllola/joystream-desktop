/**
 * Created by bedeho on 05/05/17.
 */

import React, { Component } from 'react'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'

import Table from '../../components/Table'
import {Field, Row} from  '../../components/Table'

//// Move each of these out into their own js file promptly

// TorrentToolbar

// TorrentContextMenu

function StartDownloadingHint(props) {

    return (
        <div className="hint-row">
            Drop a torrent file here to start download
        </div>)
}

@observer
class DownloadingTorrent extends Component {

    constructor(props) {
        super(props)

        this.showToolbar(false)
    }

    showToolbar(show) {
        this.setState({ showToolbar : show })
    }

    render(props) {

        // provided info_hash parametrised callbacks for each action in toolbar/context menu?
        // pause
        // start
        // remove
        // open folder on disk

        return (
            <Row onMouseEnter={() => { this.showToolbar(true) }}
                 onMouseLeave={() => { this.showToolbar(false) }}>

                <Field>
                    {this.props.torrent.name}
                </Field>
                <Field>
                    <span class="label paused-label">Paused</span>
                </Field>
                <Field>
                    {this.props.torrent.sizeMB /** later use converter **/ }
                </Field>
                <Field>
                    <span class="label paid-label">not set</span>
                </Field>
                <Field>
                    not set mB
                </Field>
                <Field>
                    not set mB
                </Field>

                { ( showToolbar ? <span><h1>show toolbar</h1></span> : null) }

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
            return <DownloadingTorrent torrent={t}/>
        })
}

export default DownloadingTorrentsTable