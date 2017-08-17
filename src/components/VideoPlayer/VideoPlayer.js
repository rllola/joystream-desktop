import React from 'react'
import CloseButton from './CloseButton'

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
      <CloseButton torrent={props.torrent} />
      <div style={overlayStyle}>
        <video width="100%" height="auto" autoPlay controls>
          <source src="https://media.w3.org/2010/05/sintel/trailer_hd.mp4" />
        </video>
      </div>
    </div>
  )
}

export default VideoPlayer
