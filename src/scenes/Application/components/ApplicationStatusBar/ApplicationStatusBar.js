/**
 * Created by bedeho on 12/10/2017.
 */

import React from 'react'
import PropTypes from 'prop-types'
import {observer } from 'mobx-react'
import StatusBar,{ProgressStatusPanel} from '../../../../components/StatusBar'

const ApplicationStatusBar = observer((props) => {

    return (

        <StatusBar show={props.store.torrentsBeingLoaded.length > 0}
                   bottom={true}
        >
            <ProgressStatusPanel title={'Loading torrents'}
                                 percentageProgress={props.store.startingTorrentCheckingProgressPercentage}
            />

        </StatusBar>
    )
})

ApplicationStatusBar.propTypes = {
    store : PropTypes.object.isRequired
}

export default ApplicationStatusBar