import React, { Component } from 'react'
import render from 'render-media'
import { Session, TorrentInfo, TorrentState } from 'joystream-node'
import {ScenarioContainer} from '../common'
import File from './File'
import os from 'os'
import path from 'path'

class Stream extends Component {
  constructor () {
    super()

    // Start Joystream session
    this._session = new Session({port: 6881})

  }

  componentDidMount() {
    this.addTorrent()
  }

  addTorrent () {
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
        var startStreaming = false

        torrent.on('state_changed', () => {
          var status = torrent.status()
          var torrentInfo = torrent.handle.torrentFile()

          if (status.state === TorrentState.downloading || status.state === TorrentState.seeding ) {
            if (!startStreaming) {
              var file = new File(torrent, 0)
              startStreaming = true
              render.append(file, '#video-player-container', function (err, elem) {
                if (err) return console.error(err.message)
                console.log(elem) // this is the newly created element with the media in it
              })
            }
          }
        })
      } else {
        console.error(err)
      }
    })
  }

  render () {
    return (
      <div id="video-player-container" >
      </div>
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
