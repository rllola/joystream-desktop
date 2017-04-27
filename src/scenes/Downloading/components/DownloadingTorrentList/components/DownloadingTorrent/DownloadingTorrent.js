import React, { Component } from 'react'
import { observer } from 'mobx-react'

@observer
class DownloadingTorrent extends Component {
  render () {
    let torrent = this.props.torrent
    return (
      <tr>
        <td>{torrent.name}</td>
        <td>{torrent.size} Mb</td>
        <td>{torrent.progressPercent}%</td>
        <td>{torrent.statusText}</td>
      </tr>
    )
  }
}

export default DownloadingTorrent
