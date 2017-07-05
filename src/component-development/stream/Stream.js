import React, { Component } from 'react'
import render from 'render-media'
import { Session, TorrentInfo } from 'joystream-node'
import {ScenarioContainer} from '../common'
import os from 'os'
import path from 'path'

class Stream extends Component {
  constructor () {
    super()

    // Start Joystream session
    this._session = new Session({port: 6881})

    // Prepared path to torrent file sintel : `$HOME/joystream/download/`
    const downloadPath = path.join(os.homedir(), 'joystream', 'download', path.sep)
    const torrentFilePath = path.join(downloadPath, 'sintel.torrent')

    // Prepare addTorrentParams with TorrentInfo object so it can be added to session
    let addTorrentParams = {
      ti: new TorrentInfo(torrentFilePath),
      path: downloadPath
    }

    this._session.addTorrent(addTorrentParams, (err, torrent) => {
      if (!err) {
        console.log('Torrent Sintel Added')
        console.log(torrent)

      } else {
        console.error(err)
      }
    })
  }

  render () {
    return (
      <video width="640" height="420" controls>
      </video>
    )
  }
}


const StreamScenario = () => {

    return (
        <div>
            <ScenarioContainer title="Stream" subtitle="stream sintel video">
            <Stream />
            </ScenarioContainer>
        </div>
    )
}

export default StreamScenario
