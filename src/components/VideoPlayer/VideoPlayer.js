import React, { Component } from 'react'
import CloseButton from './CloseButton'
import File from './File'
import render from 'render-media'

class VideoPlayer extends Component {
  componentDidMount () {
    var file = new File(this.props.torrent._torrent._client.torrent, this.props.fileIndex)
    render.render(file, '#video-player', function (err, elem) {
      if (err) return console.error(err.message)
    })
  }

  render () {
    const overlayStyle = {
      position: 'absolute',
      width: '100%',
      height: '100%',
      top: 0,
      background: 'black'
    }

    return (
      <div>
        <CloseButton torrent={this.props.torrent} />
        <div id="video-player-container" style={overlayStyle}>
          <video id="video-player" width="100%" height="auto" controls>
          </video>
        </div>
      </div>
    )
  }
}

export default VideoPlayer
