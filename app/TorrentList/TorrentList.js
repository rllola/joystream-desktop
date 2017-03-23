import React, { Component } from 'react'
import Torrent from './Torrent'

class TorrentList extends Component {
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
          {this.props.torrents.map((torrent, infoHash) => {
            return <Torrent key={infoHash} torrent={torrent} />
          })}
        </tbody>
      </table>
    )
  }
}

export default TorrentList
