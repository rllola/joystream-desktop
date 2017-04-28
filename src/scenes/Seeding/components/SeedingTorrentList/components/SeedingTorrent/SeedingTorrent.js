import React, { Component } from 'react'
import {observer} from 'mobx-react'

@observer
class SeedingTorrent extends Component {
  render () {
    let torrent = this.props.torrent
    return (
      <tr>
        <td>{torrent.name}</td>
        <td>{torrent.sizeMB} Mb</td>
        <td>{torrent.progressPercent}%</td>
        <td>{torrent.libtorrentStateText}</td>
      </tr>
    )
  }
}

export default SeedingTorrent
