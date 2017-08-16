import React, { Component } from 'react'
import { Session, TorrentInfo, TorrentState } from 'joystream-node'
import {ScenarioContainer} from '../common'
import os from 'os'
import path from 'path'

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

const VideoPlayer = (props) => {
  const overlayStyle = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    background: 'black'
  }

  return (
    <div>
      <CloseButton closeVideoPlayer={props.closeVideoPlayer} />
      <div style={overlayStyle}>
        <video width="100%" height="auto" controls>
          <source src="https://media.w3.org/2010/05/sintel/trailer_hd.mp4" />
        </video>
      </div>
    </div>
  )
}

const CloseButton = (props) => {

  const closeStyle = {
    position: 'absolute',
    top: 0,
    left: 5,
    color: 'white',
    zIndex: 99
  }

  return (
    <a style={closeStyle} onClick={props.closeVideoPlayer} href="#"><span >X</span></a>
  )
}

export default StreamScenario
