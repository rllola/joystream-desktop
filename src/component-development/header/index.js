/**
 * Created by bedeho on 29/05/17.
 */

import React from 'react'
import {ScenarioContainer} from '../common'
import Header from '../../components/Header'

import ApplicationStore from '../../core/Application/ApplicationStore'
import TorrentStore from '../../core/Torrent/TorrentStore'

import Scene from '../../core/Application/Scene'

var mockApplicationStoreHandlers = {

}

const HeaderScenarios = () => {

     var mockStore = new ApplicationStore([], 12, 321, 122, {
        addNewTorrent: () => { console.log("adding new torrent")},
        moveToScene: (s) => {

            console.log("moveToScene:" + s)

            if (s == Scene.Completed)
                mockStore.setState('Started.OnCompletedScene')
            else if (s == Scene.Downloading)
                mockStore.setState('Started.OnDownloadingScene')
            else if (s == Scene.Uploading)
                mockStore.setState('Started.OnUploadingScene')
        }
    })

    // Set to be on downloading scene
    mockStore.setState('Started.OnDownloadingScene')

    /// Add a few torrents

    // Downloading
    mockStore.torrentAdded(new TorrentStore('', "Active.DownloadingIncomplete"))
    mockStore.torrentAdded(new TorrentStore('', "Active.DownloadingIncomplete"))
    mockStore.torrentAdded(new TorrentStore('', "Active.DownloadingIncomplete"))

    // Completed
    mockStore.torrentAdded(new TorrentStore('', 'Active.FinishedDownloading'))
    mockStore.torrentAdded(new TorrentStore('', 'Active.FinishedDownloading'))

    // Uploading
    mockStore.torrentAdded(new TorrentStore('', 'Active.FinishedDownloading.Uploading'))

    return (
        <div>

            <ScenarioContainer title="Normal" subtitle="normal">
                <Header app={mockStore}/>
            </ScenarioContainer>

        </div>
    )
}



export default HeaderScenarios
