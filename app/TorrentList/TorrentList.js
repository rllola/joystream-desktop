import React, { Component } from 'react'
import {observer} from 'mobx-react'
import Torrent from './Torrent'

@observer
class TorrentList extends Component {
  filterByStatus (torrent) {
    return torrent.state === this.props.status
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
          {this.props.torrents.filter(this.filterByStatus.bind(this)).map((torrent, index) => {
            return <Torrent key={torrent.infoHash} torrent={torrent} />
          })}
        </tbody>
      </table>
    )
  }
}

export default TorrentList
