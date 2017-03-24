import React, { Component } from 'react'
import { TorrentInfo } from 'joystream-node'
import { inject } from 'mobx-react'

@inject('joystreamStore')
class AddTorrent extends Component {
  constructor (props) {
    super(props)

    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit(event) {
    event.preventDefault()

    let addTorrentParams = {
      ti: new TorrentInfo('/home/lola/joystream/test/306497171.torrent'),
      savePath: '/home/lola/joystream/test/'
    }

    this.props.joystreamStore.addTorrent(addTorrentParams)
  }

  render () {
    var afterStyle = {
      boxSizing: 'inherit'
    }

    var customFileControlBefore = {
      position: 'absolute',
      right: '-1px',
      zIndex: 6,
      display: 'block',
      height: '2.5rem',
      padding: '0.5rem 1rem',
      lineHeight: 1.5,
      color: '#464a4c',
      backgroundColor: '#eceeef',
      border: '1px solid rgba(0, 0, 0, 0.15)',
      borderRadius: '0 0.25rem 0.25rem 0'
    }

    return (
      <form className="form-inline">
        <label className="custom-file mb-2 mr-sm-2 mb-sm-0">
          <input type="file" className="custom-file-input" />
          <span style={customFileControlBefore}>Browse</span>
          <span className="custom-file-control">Choose file...</span>
        </label>
        <label>
          <input type="text" className="form-control mb-2 mr-sm-2 mb-sm-0" placeholder="Torrent Hash or Magnet Link"/>
        </label>
        <button type="submit" className="btn btn-primary">Add</button>
    </form>
    )
  }
}

export default AddTorrent
