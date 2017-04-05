import React, { Component } from 'react'
import Torrent from './Torrent'

class TorrentList extends Component {
  filterByStatus ([infoHash, torrent]) {
    return torrent.handle.status().state === this.props.status
  }

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
          {this.props.torrents.filter(this.filterByStatus.bind(this)).map(([infoHash, torrent], index) => {
            return <Torrent key={infoHash} torrent={torrent} />
          })}
        </tbody>
      </table>
    )
  }
}

export default TorrentList
