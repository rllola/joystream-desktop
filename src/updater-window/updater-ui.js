import React, {Component} from 'react'
import {observer} from 'mobx-react'
import PropTypes from 'prop-types'

@observer class Updater extends Component {

  constructor (props) {
    super(props)

    this.download = props.downloadUpdate
    this.install = props.quitAndInstall
  }

  render () {
    const state = this.props.store.state
    const showDownloadButton = state === 'waiting-to-start-download'
    const showInstallButton = state === 'waiting-to-start-install'
    const showCancelButton = state !== 'downloading'
    //const showCancelButton = true

    const spinner = this.props.store.isWorking ? <Spinner /> : null

    return (
      <div>
        {spinner}
        {getStateMessage(this.props.store)}
        {getErrorMessage(this.props.store)}
        <hr />
        <button hidden={!showDownloadButton} onClick={this.download}>Download Update</button>
        <button hidden={!showInstallButton} onClick={this.install}>Install Update</button>
        <button hidden={!showCancelButton} onClick={window.close}>Cancel</button>
      </div>
    )
  }
}

Updater.propTypes = {
  store: PropTypes.object,
  downloadUpdate: PropTypes.func,
  quitAndInstall: PropTypes.func
}

function Spinner () {
  return <div className='spinner'>== spinner ==</div>
}

const stateMessages = {
  'checking': 'Checking for updates...',
  'no-update-available': 'You are running the latest version',
  'waiting-to-start-download': 'A new version of JoyStream is available to download',
  'downloading': 'Downloading update...',
  'error': 'Error:',
  'waiting-to-start-install': 'Update downloaded and ready to install',
  'installing': 'Installing...'
}

function getStateMessage ({state}) {
  return <div>{stateMessages[state]}</div>
}

function getErrorMessage ({state, errorMessage}) {
  return state === 'error' ? <div>{errorMessage}</div> : null
}

export default Updater
