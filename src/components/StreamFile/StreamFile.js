import React, { Component } from 'react'
import File from './File'
import render from 'render-media'

class StreamFile extends Component {
  componentWillMount () {
    var file = new File(this.props.torrent, this.props.fileIndex)
    render.append(file, '#video-player-container', function (err, elem) {
      if (err) return console.error(err.message)
    })
  }

  render () {
    return (
      <div id="render-media-container" >
      </div>
    )
  }
}
