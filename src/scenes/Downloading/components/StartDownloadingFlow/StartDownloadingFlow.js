/**
 * Created by bedeho on 03/08/17.
 */
import React from 'react'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'

import {
  InvalidTorrentFileAlertDialog,
  TorrentAlreadyAddedAlertDialog} from '../../../../components/AlertDialog'

const StartDownloadingFlow = observer((props) => {
  return (
    <div>
      <InvalidTorrentFileAlertDialog
        open={props.store.state === 'Started.OnDownloadingScene.TorrentFileWasInvalid'}
        onAcceptClicked={() => { props.store.acceptTorrentFileWasInvalid() }}
        onRetryClicked={() => { props.store.retryPickingTorrentFile() }} />

      <TorrentAlreadyAddedAlertDialog
        open={props.store.state === 'Started.OnDownloadingScene.TorrentAlreadyAdded'}
        onOkClicked={() => { props.store.acceptTorrentWasAlreadyAdded() }} />
    </div>
  )
})

StartDownloadingFlow.propTypes = {
  store: PropTypes.object.isRequired
}

module.exports = StartDownloadingFlow
