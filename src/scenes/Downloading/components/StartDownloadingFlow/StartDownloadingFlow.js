/**
 * Created by bedeho on 03/08/17.
 */
import React, { Component } from 'react'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'

import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import Snackbar from 'material-ui/Snackbar'
import RaisedButton from 'material-ui/RaisedButton'
import CircularProgress from 'material-ui/CircularProgress'

const customContentStyle = {
    //width: '400px',
    //maxWidth: 'none',
};

const StartDownloadingFlow = (props) => {

    if(props.store.torrentsBeingLoaded.length > 0)
        return <TorrentLoadingScene store={props.store}/>
    else if(props.store.state == "Started.OnDownloadingScene.TorrentFileWasInvalid")
        return <InvalidTorrentFileScene store={props.store}/>
    else if(props.store.state == "Started.OnDownloadingScene.TorrentAlreadyAdded")
        return <TorrentAlreadyAddedScene store={props.store}/>
    else
        return null
}

StartDownloadingFlow.propTypes = {
    //stage : PropTypes.oneOf(Object.values(Stage)),
    //invalidTorrentFileOkClicked : PropTypes.func.isRequired
}

const TorrentLoadingScene = observer((props) => {

    var torrent = props.store.torrentsBeingLoaded[0]

    return (
        <Snackbar
            open={true}
            message={"Loading Torrent: " + torrent.state }// <== decorate message with torrent progress
        />
    )
})

const InvalidTorrentFileScene = (props) => {

    const actions = [
        <FlatButton
            label="OK"
            primary={true}
            onTouchTap={() => {props.store.acceptTorrentFileWasInvalid()}}
        />
    ]

    return (
        <Dialog
            title="Bad Torrent File"
            actions={actions}
            modal={false}
            open={true}
        >
            <h1>Invalid torrent file.</h1>

        </Dialog>
    )
}

const TorrentAlreadyAddedScene = (props) => {

    const actions = [
        <FlatButton
            label="OK"
            primary={true}
            onTouchTap={(event) => {props.store.acceptTorrentFileAlreadyAdded()}}
        />
    ]

    return (
        <Dialog
            title="Torrent already added"
            actions={actions}
            modal={false}
            open={true}
        >
            <h1>Torrent already added.</h1>

        </Dialog>
    )
}

module.exports = StartDownloadingFlow