import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import electron from 'electron'

const CloseButton = observer((props) => {

  const closeStyle = {
    position: 'absolute',
    top: 0,
    left: 5,
    color: 'white',
    zIndex: 99
  }

  const onClick = () => {
    let bounds = {
      width: 1024,
      height: 800
    }
    // restore original bounds
    // Should not be hardcoded (TODO)
    electron.ipcRenderer.send('set-bounds', bounds)
    props.torrent.close()
  }

  return (
    <a style={closeStyle} onClick={onClick} href="#"><span >X</span></a>
  )
})

CloseButton.propTypes = {
    torrent : PropTypes.object.isRequired, // TorrentStore really
}

export default CloseButton
