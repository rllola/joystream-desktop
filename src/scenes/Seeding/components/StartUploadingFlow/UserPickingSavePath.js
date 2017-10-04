/**
 * Created by bedeho on 28/09/17.
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import path from 'path'

import {InnerDialogHeading, TransparentButton} from '../../../../components/FullScreenDialog'
import ElevatedAutoLitButton from '../../../../components/ElevatedAutoLitButton'

function getStyles(props) {

    return {
        container : {
            display : 'flex',
            flexDirection : 'column',
            alignItems: 'center'
        },
        subtitle : {
            padding : '20px',
            textAlign: 'center',
            marginTop: '30px'
        },
        buttonContainer : {
            display : 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '50px'
        },
        buttonSpacer : {
            width: '100px',
            display: 'flex',
            justifyContent :'center',
            alignItems: 'center',
            fontSize: '24px',
            fontStyle: 'italic'
        },
        minorLabel : {
            fontSize : '16px',
            //fontWeight : 'bold',
            marginTop: '-5px',
            color: 'white',
            textAlign: 'center'
        }
    }
}

const UserPickingSavePath = (props) => {

    let styles = getStyles(props)
    let torrentFilePath = path.dirname(props.store.startUploadingTorrentFile)

    return (
        <InnerDialogHeading title="Download folder">

            <div style={styles.container}>

                <div style={styles.subtitle}>
                    Seeding requires that you already have the torrent data.
                </div>

                <div style={styles.buttonContainer}>

                    <TransparentButton label="Choose folder"
                                       onClick={() => { props.store.chooseSavePathButtonClicked()}}
                    />

                    <div style={styles.buttonSpacer}>
                        <span>or</span>
                    </div>

                    <ElevatedAutoLitButton title={<div>Use torrent file folder</div>}
                                           onClick={() => { props.store.useTorrentFilePathButtonClicked()}}
                                           hue={212}
                                           saturation={100}
                    >
                        <div style={styles.minorLabel}>
                            {torrentFilePath}
                        </div>
                    </ElevatedAutoLitButton>

                </div>

            </div>

        </InnerDialogHeading>
    )
}


UserPickingSavePath.propTypes = {
    store : PropTypes.object.isRequired,
}

export default UserPickingSavePath