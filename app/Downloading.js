import React, { Component } from 'react'
import { TorrentInfo, StateT } from 'joystream-node'

import TorrentList from './TorrentList'

class Downloading extends Component {

  constructor (props) {
    super(props)

    this.addTorrent = this.addTorrent.bind(this)
    this.addTorrentFile = this.addTorrentFile.bind(this)
    this.torrentAdded = this.torrentAdded.bind(this)

    this.state = {
      torrents: new Map()
    }
  }

  addTorrentFile () {
    let addTorrentParams = {
      ti: new TorrentInfo('/home/lola/joystream/test/306497171.torrent'),
      savePath: '/home/lola/joystream/test/'
    }

    session.addTorrent(addTorrentParams, this.torrentAdded)

  }

  addTorrent () {

    let addTorrentParams = {
      infoHash: '6a9759bffd5c0af65319979fb7832189f4f3c35d',
      name: 'sintel.mp4',
      savePath: '/home/lola/joystream/test/'
    }

    session.addTorrent(addTorrentParams, this.torrentAdded)
  }

  torrentAdded (err, torrent) {
    if (err) {
      console.log(err)
    } else {
      this.setState({torrents: session.torrents})
    }
  }

  render () {
    return (
      <div style={{marginTop: '20px'}} className="col-10">
        <h3>Downloading</h3>
        <br/>
        <a href="#" onClick={this.addTorrent} > Add a torrent </a>
        <br/>
        <a href="#" onClick={this.addTorrentFile} > Add a torrent with torrent file </a>
        <br/>
        <br/>
        <TorrentList torrents={this.state.torrents}/>
      </div>
    )
  }
}

export default Downloading
