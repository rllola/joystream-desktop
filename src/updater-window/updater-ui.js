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
    const showDownloadButton = this.props.store.state === 'waiting-to-start-download'
    const showInstallButton = this.props.store.state === 'waiting-to-start-install'

    const spinner = this.props.store.isWorking ? <Spinner /> : null

    return (
      <div>
        {spinner}
        <div>{this.props.store.message}</div>
        <div>{this.props.store.errorMessage}</div>
        <hr />
        <button hidden={!showDownloadButton} onClick={this.download}>Download Update</button>
        <button hidden={!showInstallButton} onClick={this.install}>Install Update</button>
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

export default Updater
