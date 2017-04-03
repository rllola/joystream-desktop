import React, { Component } from 'react'
import { TorrentInfo } from 'joystream-node'
import { inject } from 'mobx-react'

@inject('joystreamStore')
class AddTorrentForm extends Component {
  constructor (props) {
    super(props)

    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChangeFile = this.handleChangeFile.bind(this)
    this.handleChangeUrl = this.handleChangeUrl.bind(this)

    this.pathSave = __dirname + '/../../'

    this.state = {
      file: '',
      url: ''
    }
  }

  handleSubmit (event) {
    event.preventDefault()

    if (this.state.file && this.state.url) {
      return
    }

    let addTorrentParams

    if (this.state.file) {
      addTorrentParams = {
        ti: new TorrentInfo(this.state.file.path),
        savePath: this.pathSave
      }
    } else {
      if (this.state.url.startsWith('magnet:')) {
        addTorrentParams = {
          url: this.state.url,
          savePath: this.pathSave
        }
      } else {
        addTorrentParams = {
          infoHash: this.state.url,
          savePath: this.pathSave
        }
      }
    }

    this.props.joystreamStore.addTorrent(addTorrentParams)
  }

  handleChangeFile (event) {
    this.setState({file: event.target.files[0], url: ''})
  }

  handleChangeUrl (event) {
    this.setState({url: event.target.value})
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
      <form className="form-inline" onSubmit={this.handleSubmit}>
        <label className="custom-file mb-2 mr-sm-2 mb-sm-0">
          <input type="file" onChange={this.handleChangeFile} className="custom-file-input" />
          <span style={customFileControlBefore}>Browse</span>
          <span className="custom-file-control">{ this.state.file ? this.state.file.name : 'Choose file...'}</span>
        </label>
        <label>
          <input type="text" value={this.state.url} onChange={this.handleChangeUrl} className="form-control mb-2 mr-sm-2 mb-sm-0" placeholder="Torrent Hash or Magnet Link"/>
        </label>
        <button type="submit" className="btn btn-primary">Add</button>
    </form>
    )
  }
}

export default AddTorrentForm
