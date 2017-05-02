import React, { Component } from 'react'
import { observer } from 'mobx-react'
import CompletedTorrent from './components/CompletedTorrent'

@observer
class CompletedTorrentList extends Component {
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
            return <CompletedTorrent key={torrent.infoHash} torrent={torrent} />
          })}
        </tbody>
      </table>
    )
  }
}

export default CompletedTorrentList
