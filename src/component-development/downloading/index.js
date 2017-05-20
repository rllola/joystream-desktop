/**
 * Created by bedeho on 12/05/17.
 */

import React from 'react'
import DownloadingTorrentsTable from '../../scenes/Downloading/DownloadingTorrentsTable'
import TorrentToolbar from '../../scenes/Downloading/TorrentToolbar'
import TorrentContextMenu from '../../scenes/Downloading/TorrentContextMenu'

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

class MockTorrent {

    constructor(info_hash, name, size, downloaded_quantity, progress, download_speed, paused, paid) {
        this.info_hash = info_hash
        this.name = name
        this.size = size
        this.downloaded_quantity = downloaded_quantity
        this.progress = progress
        this.download_speed = download_speed
        this.paused = paused
        this.paid = paid
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

const Downloading = () => {

    var torrents = [
        new MockTorrent("info_hash_1", "My fake torrent", 1025, 213, 22, 32, false, true),
        new MockTorrent("info_hash_2", "Great content being downloaded", 47839, 21123, 231, 32, false, false),
        new MockTorrent("info_hash_3", "My archive of stuff", 1021212, 21123, 231, 32, true, true),
        new MockTorrent("info_hash_4", "Another mocked one", 50124, 1235, 89, 98, true, false)
    ]

    return (
        <div>

            <ScenarioContainer title="Empty table" subtitle="An empty table">
                <DownloadingTorrentsTable torrents={[]}/>
            </ScenarioContainer>

            <ScenarioContainer title="Non-empty table" subtitle="A non-empty table">
                <DownloadingTorrentsTable torrents={torrents} />
            </ScenarioContainer>

            <ScenarioContainer title="Toolbar">
                <TorrentToolbar canSpeedup = {true}
                                onSpeedupClicked={() => {console.log("speedup clicked")}}
                                onOpenFolderClicked={() => {console.log("open folder clicked")}}
                                onMoreClicked={() => {console.log("more clicked")}}/>
            </ScenarioContainer>

            <ScenarioContainer title="Context menu">
                <TorrentContextMenu onHide={() => { console.log("hide context menu now")}}
                                    paused={true}
                                    onChangePauseStatus = {() => {console.log("change pause status clicked")}}
                                    changePriceEnabled={true}
                                    onContinueClicked={() => { console.log("continue clicked")}}
                                    onChangePriceClicked={() => { console.log("change price clicked")}}
                                    onRemoveClicked={() => { console.log("remove clicked")}}
                                    onRemoveAndDeleteDataClicked={() => { console.log("remove and delete data clicked")}}
                                    number_of_buyers={24}
                                    number_of_sellers={13}
                                    number_of_observers={0}
                                    number_of_normal_peers={768}/>
            </ScenarioContainer>

        </div>
    )
}



export default Downloading