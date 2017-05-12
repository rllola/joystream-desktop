import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import PropTypes from 'prop-types'

import DownloadingTorrentsTable from './DownloadingTorrentsTable'

@inject('sessionStore')
@observer
class Downloading extends Component {

    log_props() {
        console.log(this.props)
    }

    render() {
        return (
            <div className="downloading-scene-container">

                <section className="middle-section">

                    <div className="indicators">
                        <span className="flex-spacer"></span>
                        <span className="label">Revenue</span>
                        <span className="quantity">{this.props.revenue} mB</span>
                        <span className="vertical-bar"></span>
                        <span className="label">Bandwidth</span>
                        <span className="quantity">{this.props.down_speed} Kb/s</span>
                    </div>

                    <div className="toolbar-section">

                        <div className="heading">
                            <h1>Downloading</h1>
                            <h2> {this.props.sessionStore.torrentsDownloading.length} downloads</h2>
                        </div>
                        <div className="vertical-bar"></div>
                        <div className="button-section">
                            <div className="button">Start Download</div>
                        </div>

                    </div>

                </section>

                <DownloadingTorrentsTable torrents={this.props.sessionStore.torrentsDownloading} />

            </div>
        )
    }
}

Downloading.propTypes = {
    //torrents :
    //revenue : PropTypes.number.isRequired,
    //down_speed : PropTypes.number.isRequired,
    //onStartDownload : PropTypes.func.isRequired
}

export default Downloading
