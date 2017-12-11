/**
 * Created by bedeho on 26/09/17.
 */

import React from 'react'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'

import FullScreenDialog from '../../../../components/FullScreenDialog'
import LoadingTorrentForUploading from './LoadingTorrentForUploading'
import UserPickingSavePath from './UserPickingSavePath'
import IncompleteDownloadWarning from './IncompleteDownloadWarning'

import {
  InvalidTorrentFileAlertDialog,
  TorrentAlreadyAddedAlertDialog
} from '../../../../components/AlertDialog'

const StartUploadingFlow = observer((props) => {
  let state = props.store.state

  let fullScreenDialogContent
  let enableCloseButton = true
  let fullScreen =
  // state === 'Started.OnUploadingScene.UserSelectingTorrentFileOrRawContent' ||
  // state === 'Started.OnUploadingScene.TorrentFileWasInvalid' ||
  // state === 'Started.OnUploadingScene.TorrentAlreadyAdded' ||
  state === 'Started.OnUploadingScene.UserPickingSavePath' ||
  state === 'Started.OnUploadingScene.LoadingTorrentForUploading' ||
  state === 'Started.OnUploadingScene.TellUserAboutIncompleteDownload'

  switch (state) {
    case 'Started.OnUploadingScene.UserPickingSavePath':
      fullScreenDialogContent = <UserPickingSavePath {...props} />
      break
    case 'Started.OnUploadingScene.LoadingTorrentForUploading':
      fullScreenDialogContent = <LoadingTorrentForUploading {...props} />
      break
    case 'Started.OnUploadingScene.TellUserAboutIncompleteDownload':
      fullScreenDialogContent = <IncompleteDownloadWarning store={props.store} />
      break
    default:
      fullScreenDialogContent = null
  }

  return (
    <div>
      <InvalidTorrentFileAlertDialog
        store={props.store}
        open={state === 'Started.OnUploadingScene.TorrentFileWasInvalid'}
        onAcceptClicked={() => { props.store.acceptTorrentFileWasInvalid() }}
        onRetryClicked={() => { props.store.retryPickingTorrentFile() }} />

      <TorrentAlreadyAddedAlertDialog
        store={props.store}
        open={props.store.state === 'Started.OnUploadingScene.TorrentAlreadyAdded'}
        onOkClicked={() => { props.store.acceptTorrentWasAlreadyAdded() }} />

      <FullScreenDialog
        closeClick={() => { props.store.exitStartUploadingFlow() }}
        open={fullScreen}
        enableCloseButton={enableCloseButton} >
        { fullScreenDialogContent }
      </FullScreenDialog>
    </div>
  )
})

StartUploadingFlow.propTypes = {
  store: PropTypes.object.isRequired
}

export default StartUploadingFlow
