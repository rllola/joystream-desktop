import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'

import DownloadingTorrentList from './components/DownloadingTorrentList'
import AddTorrentForm from '../../components/AddTorrentForm'

@inject('sessionStore')
@observer
class Downloading extends Component {

    /**
  render () {
    return (
      <div style={{marginTop: '20px'}} className="col-10">
        <h3>Downloading</h3>
        <br />
        <AddTorrentForm onSubmit={this.props.sessionStore.handleAddTorrent} />
        <br />
        <br />
        <DownloadingTorrentList torrents={this.props.sessionStore.torrentsDownloading} />
      </div>
    )
  }
     */

    render() {
        return (
            <section className="middle-section">

                <div className="indicators">
                    <span className="flex-spacer"></span>
                    <span className="label">Revenue</span>
                    <span className="quantity">1235 mB</span>
                    <span className="vertical-bar"></span>
                    <span className="label">Bandwidth</span>
                    <span className="quantity">456 Kb/s</span>
                </div>

                <div className="toolbar-section">

                    <div className="heading">
                        <h1>Uploading</h1>
                        <h2>11 seeds</h2>
                    </div>
                    <div className="vertical-bar"></div>
                    <div className="button-section">
                        <div className="button">Start upload</div>
                    </div>

                </div>

            </section>
        )
    }
}

export default Downloading
