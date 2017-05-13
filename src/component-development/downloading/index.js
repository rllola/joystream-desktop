/**
 * Created by bedeho on 12/05/17.
 */

import React from 'react'
import DownloadingTorrentsTable from '../../scenes/Downloading/DownloadingTorrentsTable'

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

class MockTorrent {

    constructor(info_hash, name, size, downloaded_quantity, progress, download_speed) {
        this.info_hash = info_hash
        this.name = name
        this.size = size
        this.downloaded_quantity = downloaded_quantity
        this.progress = progress
        this.download_speed = download_speed
    }
}

const ScenarioContainer = (props) => {

    return (
        <div style={{paddingBottom : 40}}>
            <Card>
                <CardTitle title={props.title} subtitle={props.subtitle} />
                {props.children}
            </Card>
        </div>
    )
}

const Downloading = (props) => {

    var torrents = [
        new MockTorrent("info_hash_1", "My fake torrent", 1023, 213, 22, 3245),
        new MockTorrent("info_hash_2","Another mocked one", 50123, 1235, 89, 9890)
    ]

    return (
        <div>

            <ScenarioContainer title="Empty table" subtitle="An empty table">
                <DownloadingTorrentsTable torrents={[]}/>
            </ScenarioContainer>

            <ScenarioContainer title="Non-empty table" subtitle="A non-empty table">
                <DownloadingTorrentsTable torrents={torrents} />
            </ScenarioContainer>
        </div>
    )
}



export default Downloading