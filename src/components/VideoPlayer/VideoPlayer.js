import React, { Component } from 'react'
import CloseButton from './CloseButton'
import render from 'render-media'

class VideoPlayer extends Component {
  constructor (props) {
    super(props)

    this.state = {displayCloseButton: true}
  }

  componentDidMount () {
    render.render(this.props.file, '#video-player', (err, elem) => {
      if (err) return console.error(err.message)
    })
  }

  handleMouseEnter () {
    this.setState({displayCloseButton: true})
  }

  handleMouseLeave () {
    this.setState({displayCloseButton: false})
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
      <div id="video-player-container" onMouseEnter={this.handleMouseEnter.bind(this)} onMouseLeave={this.handleMouseLeave.bind(this)} >
        { this.state.displayCloseButton ? <CloseButton torrent={this.props.torrent} /> : null }
        <div style={overlayStyle}>
          <video id="video-player" onLoadedMetadata={this.props.torrent.onLoadedMetadata} style={videoStyle} controls>
          </video>
        </div>
      </div>
    )
  }
}

export default VideoPlayer
