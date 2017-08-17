import React, { Component } from 'react'
import { Session, TorrentInfo, TorrentState } from 'joystream-node'
import {ScenarioContainer} from '../common'
import os from 'os'
import path from 'path'
import VideoPlayer from '../../components/VideoPlayer'

class StreamScenario extends Component {
  constructor () {
    super()

    this.state = {
      videoPlayer: false
    }
  }

  handleClick (event) {
    event.preventDefault()

    this.setState({videoPlayer: true})
  }

  handleClose (event) {
    event.preventDefault()

    this.setState({videoPlayer: false})
  }

  render () {
    const blockStyle = {
      position: 'relative',
      width: '100%',
      height: '100%'
    }

    return (
      <div>
          <ScenarioContainer title="Stream" subtitle="stream sintel video">
            <div style={blockStyle} >
              <h1>Some scenes here</h1>
              <br/>
              <br/>
              <button onClick={this.handleClick.bind(this)}>Play</button>
              {this.state.videoPlayer ? <VideoPlayer closeVideoPlayer={this.handleClose.bind(this)} /> : null}
              <br/>
              <br/>
            </div>
          </ScenarioContainer>
      </div>
    )
  }
}

export default StreamScenario
