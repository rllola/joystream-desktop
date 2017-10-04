/**
 * Created by bedeho on 26/09/17.
 */

import React from 'react'
import { inject, observer } from 'mobx-react'
import PropTypes from 'prop-types'

import FullScreenDialog from '../../../../components/FullScreenDialog'
import UserSelectingTorrentFileOrRawContentScene from './UserSelectingTorrentFileOrRawContentScene'
import LoadingTorrentForUploading from './LoadingTorrentForUploading'
import UserPickingSavePath from './UserPickingSavePath'
import IncompleteDownloadWarning from './IncompleteDownloadWarning'

import {
    InvalidTorrentFileAlertDialog,
    TorrentAlreadyAddedAlertDialog,
    IncompleteDownloadAlertDialog
} from '../../../../components/AlertDialog'

function getStyles(props) {

    return {

    }
}

const StartUploadingFlow = observer((props) => {

    let state = props.store.state

    console.log(state)

    let fullScreenDialogContent = null
    let enableCloseButton = true
    let fullScreen =
        //state === 'Started.OnUploadingScene.UserSelectingTorrentFileOrRawContent' ||
        //state === 'Started.OnUploadingScene.TorrentFileWasInvalid' ||
        //state === 'Started.OnUploadingScene.TorrentAlreadyAdded' ||
        state === 'Started.OnUploadingScene.UserPickingSavePath' ||
        state === 'Started.OnUploadingScene.LoadingTorrentForUploading' ||
        state === 'Started.OnUploadingScene.TellUserAboutIncompleteDownload'

    if(state === 'Started.OnUploadingScene.UserPickingSavePath')
        fullScreenDialogContent = <UserPickingSavePath {...props} />
    else if(state === 'Started.OnUploadingScene.LoadingTorrentForUploading')
        fullScreenDialogContent = <LoadingTorrentForUploading {...props}/>
    else if(state === 'Started.OnUploadingScene.TellUserAboutIncompleteDownload')
        fullScreenDialogContent = <IncompleteDownloadWarning store={props.store} />

    return (
        <div>
            <InvalidTorrentFileAlertDialog store={props.store}
                                           open={state === 'Started.OnUploadingScene.TorrentFileWasInvalid'}
                                           onAcceptClicked={() => { props.store.acceptTorrentFileWasInvalid() }}
                                           onRetryClicked={() => { props.store.retryPickingTorrentFile() }}
            />
            <TorrentAlreadyAddedAlertDialog store={props.store}
                                            open={props.store.state === "Started.OnUploadingScene.TorrentAlreadyAdded"}
                                            onOkClicked={() => { props.store.acceptTorrentWasAlreadyAdded()} }

            />

            <FullScreenDialog closeClick={() => { props.store.exitStartUploadingFlow()}}
                              open={fullScreen}
                              enableCloseButton={enableCloseButton}
            >
                { fullScreenDialogContent }
            </FullScreenDialog>
        </div>
    )

})



StartUploadingFlow.propTypes = {
    store : PropTypes.object.isRequired
}

export default StartUploadingFlow