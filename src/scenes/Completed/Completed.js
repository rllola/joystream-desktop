import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import PropTypes from 'prop-types'

import { TorrentTable } from './components'

const Completed = (props) => {

    console.log(props.torrents)

    return (
        <div className="downloading-scene-container">
            <section className="middle-section">
                <div className="toolbar-section">
                    <div className="heading">
                        <h1>Completed</h1>
                        <h2> {props.torrents.length} completed torrent</h2>
                    </div>
                    <div className="vertical-bar"></div>

                </div>

            </section>

            <TorrentTable torrents={props.torrents} store={props.store} />

        </div>
    )
}

Completed.propTypes = {
    torrents : PropTypes.array.isRequired
}

export default Completed
