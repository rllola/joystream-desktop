import React, { Component } from 'react'
import { observer } from 'mobx-react'
import DownloadingTorrent from './components/DownloadingTorrent'

@observer
class DownloadingTorrentList extends Component {
  render () {
    return (
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Size</th>
            <th>Progress</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {this.props.torrents.map((torrent, index) => {
            return <DownloadingTorrent key={torrent.infoHash} torrent={torrent} />
          })}
        </tbody>
      </table>
    )
  }
}

export default DownloadingTorrentList
