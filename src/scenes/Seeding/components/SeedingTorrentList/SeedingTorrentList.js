import React, { Component } from 'react'
import {observer} from 'mobx-react'
import SeedingTorrent from './components/SeedingTorrent'

@observer
class SeedingTorrentList extends Component {
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
            return <SeedingTorrent key={torrent.infoHash} torrent={torrent} />
          })}
        </tbody>
      </table>
    )
  }
}

export default SeedingTorrentList
