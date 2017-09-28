/**
 * Created by bedeho on 03/08/17.
 */
import React, { Component } from 'react'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'

import AlertDialog from '../../../../components/AlertDialog'

const StartDownloadingFlow = (props) => {

    return (
        <div>
            <InvalidTorrentFileScene store={props.store}/>
            <TorrentAlreadyAddedScene store={props.store}/>
        </div>
    )

}

StartDownloadingFlow.propTypes = {
    store : PropTypes.object.isRequired
}

const InvalidTorrentFileScene = observer((props) => {

    let buttonClicked = (title) => {

        if(title === "NO") {
            props.store.acceptTorrentFileWasInvalid()
        } else if(title === "TRY AGAIN") {
            props.store.retryPickingTorrentFile()
        }

    }

    return (
        <AlertDialog
            title="Torrent file is invalid"
            body={"Would you like to try picking another file?"}
            open={props.store.state == "Started.OnDownloadingScene.TorrentFileWasInvalid"}
            buttonTitles={["NO", "TRY AGAIN"]}
            buttonClicked={buttonClicked}
        />
    )
})

const TorrentAlreadyAddedScene = observer((props) => {

    let buttonClicked = (title) => {
        props.store.acceptTorrentWasAlreadyAdded()
    }

    return (
        <AlertDialog
            title="Torrent already added"
            body={"You cannot add it twice."}
            open={props.store.state == "Started.OnDownloadingScene.TorrentAlreadyAdded"}
            buttonTitles={["OK"]}
            buttonClicked={buttonClicked}
        />
    )
})

module.exports = StartDownloadingFlow