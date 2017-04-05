import React, { Component } from 'react'
import { StateT } from 'joystream-node'

class Torrent extends Component {
  constructor (props) {
    super(props)

  }

  render () {
    var torrentHandle = this.props.torrent.handle
    var torrentInfo = torrentHandle.torrentFile()
    var status = torrentHandle.status()

    if (!torrentInfo) {
      // torrent_info not yet set need to come from peers
      this.props.torrent.on('metadata_received_alert', (torrentInfo) => {
        this.forceUpdate()
      })
    } else {

      this.props.torrent.on('state_update_alert', (state, progress) => {
        this.forceUpdate()
      })

      this.props.torrent.on('torrent_finished_alert', () =>{
        this.forceUpdate()
      })
    }

    var statusText = StateT.properties[status.state].name

    return (
      <tr>
        <td>{torrentInfo.name()}</td>
        <td>{Number(torrentInfo.totalSize() / 1000000).toFixed(2)} Mb</td>
        <td>{Number(status.progress*100).toFixed(0)}%</td>
        <td>{statusText}</td>
      </tr>
    )
  }
}

export default Torrent
