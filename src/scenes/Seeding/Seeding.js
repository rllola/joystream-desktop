import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import PropTypes from 'prop-types'

import TorrentTable from './TorrentTable'

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
                        <h1>Seeding</h1>
                        <h2> {props.torrents.length} seedings</h2>
                    </div>
                    <div className="vertical-bar"></div>
                    <div className="button-section">
                        <div className="button" onClick={props.onStartUploadClicked}>Start Upload</div>
                    </div>

                </div>

            </section>

            {/*<TorrentTable torrents={props.torrents} />*/}

        </div>
    )
}

Seeding.propTypes = {
    torrents : PropTypes.array.isRequired,
    revenue : PropTypes.number.isRequired,
    uploadSpeed : PropTypes.number.isRequired,
    onStartUploadCliked : PropTypes.func.isRequired
}

export default Seeding
