import React, { Component } from 'react'
import Torrent from './Torrent'

class TorrentList extends Component {

  constructor (props) {
    super(props)
  }

  render () {
    let rows = []

    this.props.torrents.forEach((torrent, infoHash) => {
      console.log(torrent)
      rows.push(<Torrent key={infoHash} torrent={torrent} />)
    })

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
          { rows }
        </tbody>
      </table>
    )
  }
}

export default TorrentList
