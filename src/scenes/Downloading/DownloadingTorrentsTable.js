/**
 * Created by bedeho on 05/05/17.
 */

import React, { Component } from 'react'
import { observer } from 'mobx-react'

import Table from '../../components/Table'
import {Field, Row} from  '../../components/Table'

//// Move each of these out into their own js file promptly

// TorrentToolbar

// TorrentContextMenu

function StartDownloadingHint(props) {

    return (
        <Row>
            <h1>yo - no torrents here!</h1>
        </Row>)
}

@observer
class DownloadingTorrent extends Component {

    constructor(props) {
        super(props)

        this.state = { showToolbar : false }
    }

    render(props) {

        // how to render toolbar
        // how to render drop down from toolbar????

        return (

            // onMouseEnter&onMouseLeave must mutate this.showToolbar

            <Row onMouseEnter={() => { console.log(" entering UI element for downloading torrent: ...") }}
                 onMouseLeave={() => { console.log(" leaving UI element for downloading torrent: ...") }}>

                <Field>
                    The greatest CC motion picture ever.mp4
                </Field>
                <Field>
                    <span class="label paused-label">Paused</span>
                </Field>
                <Field>
                    34 MB/s
                </Field>
                <Field>
                    <span class="label paid-label">Paid</span>
                </Field>
                <Field>
                    234 mB
                </Field>
                <Field>
                    412 mB
                </Field>

            </Row>
        )
    }
}

DownloadingTorrent.propTypes = {
    //torrent : PropTypes.object should we here _require_ a TorrentStore?
}

const DownloadingTorrentsTable = function(props) {

    // A) How to give event handlers for each torrent???? where do we get info_hash or whtever from? or do we do something else?
    // B) what about

    // provided info_hash parametrised callbacks for each action in toolbar/context menu?
    // pause
    // start
    // remove
    // open folder on disk

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
        return <StartDownloadingHint />
    else
        return torrents.map((t) => {
            return <DownloadingTorrent torrent={t}/>
        })
}

export default DownloadingTorrentsTable