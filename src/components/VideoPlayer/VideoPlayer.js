import React, { Component } from 'react'
import CloseButton from './CloseButton'
import render from 'render-media'


class VideoPlayer extends Component {
  componentDidMount () {
    render.render(this.props.file, '#video-player', function (err, elem) {
      if (err) return console.error(err.message)
    })
  }

  render () {
    const overlayStyle = {
      position: 'absolute',
      width: '100%',
      height: '100%',
      top: 0,
      background: 'black',
      overflow: 'hidden'
    }

    const videoStyle = {
      minHeight: '100%',
      height: 'auto',
      width: '100%'
    }

    return (
      <div>
        <CloseButton torrent={this.props.torrent} />
        <div id="video-player-container"  style={overlayStyle}>
          <video id="video-player" onLoadedMetadata={this.props.onLoadedMetadata} style={videoStyle} controls>
          </video>
        </div>
      </div>
    )
  }
}

export default VideoPlayer
