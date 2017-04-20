import React, { Component } from 'react'
import {observer} from 'mobx-react'
import Torrent from './components/Torrent'

@observer
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
          {this.props.torrents.map((torrent, index) => {
            return <Torrent key={torrent.infoHash} torrent={torrent} />
          })}
        </tbody>
      </table>
    )
  }
}

export default TorrentList
