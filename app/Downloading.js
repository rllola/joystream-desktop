import React, { Component } from 'react'
import { TorrentInfo } from 'joystream-node'
import { inject, observer } from 'mobx-react'

import TorrentList from './TorrentList/'

@inject('joystreamStore')
@observer
class Downloading extends Component {

  constructor (props) {
    super(props)

    this.addTorrentFile = this.addTorrentFile.bind(this)

  }

  addTorrentFile () {
    let addTorrentParams = {
      ti: new TorrentInfo('/home/lola/joystream/test/306497171.torrent'),
      savePath: '/home/lola/joystream/test/'
    }

    this.props.joystreamStore.addTorrent(addTorrentParams)

  }

  render () {
    return (
      <div style={{marginTop: '20px'}} className="col-10">
        <h3>Downloading</h3>
        <br/>
        <form className="form-inline">
          <label className="sr-only" for="torrentFile">Torrent file</label>
          <input type="file" className="form-control-file" id="torrentFile" aria-describedby="torrent file" />
          <label className="sr-only" for="torrentIdentifier">Torrent Hash or Magnet Link</label>
          <input type="text" className="form-control" placeholder="Torrent Hash or Magnet Link" id="torrentIdentifier" aria-describedby="Torrent Hash or Magnet Link" />
        </form>
        <br/>
        <br/>
        <TorrentList torrents={this.props.joystreamStore.torrents}/>
      </div>
    )
  }
}

export default Downloading
