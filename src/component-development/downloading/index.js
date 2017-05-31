/**
 * Created by bedeho on 12/05/17.
 */

import React from 'react'

import {ScenarioContainer} from '../common'

import TorrentTable from '../../scenes/Downloading/TorrentTable'
import TorrentToolbar from '../../scenes/Downloading/TorrentToolbar'
import TorrentContextMenu from '../../scenes/Downloading/TorrentContextMenu'

class MockTorrent {

    constructor(fields) {

        this.info_hash = fields.info_hash
        this.name = fields.name
        this.size = fields.size
        this.downloaded_quantity = fields.downloaded_quantity
        this.progress = fields.progress
        this.download_speed = fields.download_speed
        this.paused = fields.paused
        this.paid = fields.paid
        this.canStartBuying = fields.canStartBuying
        this.canChangePrice = fields.canChangePrice
        this.numberOfBuyerPeers = fields.numberOfBuyerPeers
        this.numberOfSellerPeers = fields.numberOfSellerPeers
        this.numberOfObserverPeers = fields.numberOfObserverPeers
        this.numberOfNormalPeers = fields.numberOfNormalPeers
    }

    startBuying() {
        console.log("startBuying: " + this.name)
    }

    openFolder() {
        console.log("openFolder: " + this.name)
    }

    changePauseStatus() {
        console.log("changePauseStatus: " + this.name)
    }

    showChangePriceDialog() {
        console.log("showChangePriceDialog: " + this.name)
    }

    remove() {
        console.log("remove: " + this.name)
    }

    removeAndDeleteData() {
        console.log("removeAndDeleteData: " + this.name)
    }
}

const DownloadingSceneScenarios = () => {

    var torrents = [
        new MockTorrent({ info_hash : "info_hash_1",
            name : "My fake torrent",
            size : 1025,
            downloaded_quantity : 213,
            progress : 22,
            download_speed : 32,
            paused : false,
            paid : true,
            canStartBuying : false,
            canChangePrice : true,
            numberOfBuyerPeers : 452,
            numberOfSellerPeers : 12,
            numberOfObserverPeers : 5,
            numberOfNormalPeers : 1
        }),
        new MockTorrent({
            info_hash : "info_hash_2",
            name : "My pretty content",
            size : 1025223223,
            downloaded_quantity : 54322,
            progress : 11,
            download_speed : 3222323,
            paused : true,
            paid : true,
            canStartBuying : false,
            canChangePrice : false,
            numberOfBuyerPeers : 428,
            numberOfSellerPeers : 92,
            numberOfObserverPeers : 521,
            numberOfNormalPeers : 44
        }),
        new MockTorrent({
            info_hash : "info_hash_3",
            name : "Favourite data",
            size : 65330252232,
            downloaded_quantity : 512432,
            progress : 32,
            download_speed : 12332223,
            paused : true,
            paid : false,
            canStartBuying : true,
            canChangePrice : false,
            numberOfBuyerPeers : 4812,
            numberOfSellerPeers : 219,
            numberOfObserverPeers : 115,
            numberOfNormalPeers : 324
        }),
        new MockTorrent({
            info_hash : "info_hash_4",
            name : "Hello my dear user 19821",
            size : 3420252232,
            downloaded_quantity : 44132,
            progress : 18,
            download_speed : 23132223,
            paused : false,
            paid : false,
            canStartBuying : true,
            canChangePrice : false,
            numberOfBuyerPeers : 481,
            numberOfSellerPeers : 92,
            numberOfObserverPeers : 15,
            numberOfNormalPeers : 44
        }),
        new MockTorrent({
            info_hash : "info_hash_5",
            name : "Some other great file",
            size : 10252232,
            downloaded_quantity : 5432,
            progress : 88,
            download_speed : 32223,
            paused : false,
            paid : false,
            canStartBuying : true,
            canChangePrice : false,
            numberOfBuyerPeers : 48,
            numberOfSellerPeers : 9,
            numberOfObserverPeers : 5,
            numberOfNormalPeers : 4
        }),

    ]

    return (
        <div>

            <ScenarioContainer title="Empty table" subtitle="An empty table">
                <TorrentTable torrents={[]}/>
            </ScenarioContainer>

            <ScenarioContainer title="Non-empty table" subtitle="A non-empty table">
                <TorrentTable torrents={torrents} />
            </ScenarioContainer>

            <ScenarioContainer title="Toolbar">
                <TorrentToolbar canSpeedup = {true}
                                onSpeedupClicked={() => {console.log("speedup clicked")}}
                                onOpenFolderClicked={() => {console.log("open folder clicked")}}
                                onMoreClicked={() => {console.log("more clicked")}}/>
            </ScenarioContainer>

            <ScenarioContainer title="Context menu">
                <TorrentContextMenu onOutsideContextMenuClicked = {() => {}}
                                    paused = {false}
                                    onChangePauseStatus = {() => {console.log("Changing pause status")}}
                                    changePriceEnabled = {true}
                                    onChangePriceClicked = {() => {console.log("Change price clicked")}}
                                    onRemoveClicked = {() => {console.log("Remove and click")}}
                                    onRemoveAndDeleteDataClicked = {() => {console.log("Remove and delete data clicked")}}
                                    number_of_buyers = {1}
                                    number_of_sellers = {263}
                                    number_of_observers = {209}
                                    number_of_normal_peers = {23}/>
            </ScenarioContainer>

        </div>
    )
}

export default DownloadingSceneScenarios