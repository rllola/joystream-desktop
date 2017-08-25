import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import PropTypes from 'prop-types'
import {remote} from 'electron'

import TorrentTable from './TorrentTable'
import StartDownloadingFlow, {Stage} from './components/StartDownloadingFlow'

const Downloading = observer((props) => {


    return (
        <div className="downloading-scene-container">

            <section className="middle-section">

                <div className="indicators">
                    <span className="flex-spacer"></span>
                    <span className="label">Revenue</span>
                    <span className="quantity">{props.revenue} B</span>
                    <span className="vertical-bar"></span>
                    <span className="label">Bandwidth</span>
                    <span className="quantity">{props.downloadSpeed} Kb/s</span>
                </div>

                <div className="toolbar-section">

                    <div className="heading">
                        <h1>Downloading</h1>
                        <h2> {props.torrents.length} torrents</h2>
                    </div>
                    <div className="vertical-bar"></div>
                    <div className="button-section">
                        <div className="button" onClick={props.onStartDownloadClicked}>DOWNLOAD</div>
                    </div>

                </div>

            </section>

            <TorrentTable torrents={props.torrents} store={props.store} />

            <StartDownloadingFlow store={props.store}/>

        </div>
    )
})

Downloading.propTypes = {
    torrents : PropTypes.any.isRequired,
    revenue : PropTypes.number.isRequired,
    downloadSpeed : PropTypes.number.isRequired,
    onStartDownloadClicked : PropTypes.func.isRequired,
    torrentsBeingLoaded : PropTypes.array.isRequired
}

export default Downloading
