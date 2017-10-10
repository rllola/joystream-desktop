/**
 * Created by bedeho on 09/10/2017.
 */

import React from 'react'
import PropTypes from 'prop-types'
import CircularProgress from 'material-ui/CircularProgress'

const Downloading = (props) => {

    let styles = {
        root: {
            display : 'flex',
            flexDirection: 'column',
            alignItems : 'center',
            justifyContent: 'center'
        },
        title : {
            fontSize: '32px',
            color: 'white',
            fontWeight: 'bold',
            textAlign: 'center',
            paddingTop: '54px',
            paddingBottom: '30px'
        }
    }

    return (

        <div style={styles.root}>

            <div style={styles.title}>
                Downloading update
            </div>

            <CircularProgress size={100}
                              thickness={5}
                              color={'#ffffff'}
            />

        </div>

    )
}

export default Downloading