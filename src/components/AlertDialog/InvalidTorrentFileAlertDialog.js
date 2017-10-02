/**
 * Created by bedeho on 29/09/17.
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'

import AlertDialog from './AlertDialog'

const InvalidTorrentFileAlertDialog = (props) => {

    let buttonClicked = (title) => {

        if(title === "NO") {
            props.onAcceptClicked()
        } else if(title === "TRY AGAIN") {
            props.onRetryClicked()
        }

    }

    return (
        <AlertDialog
            title="Torrent file is invalid"
            body={"Would you like to try picking another file?"}
            open={props.open}
            buttonTitles={["NO", "TRY AGAIN"]}
            buttonClicked={buttonClicked}
        />
    )
}

InvalidTorrentFileAlertDialog.propTypes = {
    open : PropTypes.bool.isRequired,
    onAcceptClicked : PropTypes.func.isRequired,
    onRetryClicked : PropTypes.func.isRequired,
}

export default InvalidTorrentFileAlertDialog