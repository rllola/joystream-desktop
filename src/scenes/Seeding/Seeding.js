import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import PropTypes from 'prop-types'

import TorrentTable from './TorrentTable'
import StartUploadingFlow from './components/StartUploadingFlow'

const Seeding = (props) => {

    return (
        <div className="downloading-scene-container">

            <section className="middle-section">

                <div className="indicators">
                    <span className="flex-spacer"></span>
                    <span className="label">Revenue</span>
                    <span className="quantity">{props.revenue} B</span>
                    <span className="vertical-bar"></span>
                    <span className="label">Bandwidth</span>
                    <span className="quantity">{props.uploadSpeed} Kb/s</span>
                </div>

                <div className="toolbar-section">

                    <div className="heading">
                        <h1>Uploading</h1>
                        <h2> {props.torrents.length} torrents</h2>
                    </div>
                    <div className="vertical-bar"></div>
                    <div className="button-section">
                        <div className="button" onClick={props.onStartUploadCliked}>UPLOAD</div>
                    </div>

                </div>

            </section>

            <TorrentTable torrents={props.torrents} store={props.store} />

            <StartUploadingFlow store={props.store}/>

        </div>
    )
}

Seeding.propTypes = {
    torrents : PropTypes.array.isRequired,
    revenue : PropTypes.number.isRequired,
    uploadSpeed : PropTypes.number.isRequired,
    onStartUploadCliked : PropTypes.func.isRequired,
    store : PropTypes.object.isRequired
}

export default Seeding
