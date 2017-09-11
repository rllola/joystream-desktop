/**
 * Created by bedeho on 02/06/17.
 */

import React from 'react'
import PropTypes from 'prop-types'
import LoadingState from './LoadingState'
import SplashProgress from '../../components/SplashProgress'

function progressTextFromLoadingState(state) {

    let text = null

    switch(state) {

        case LoadingState.InitializingResources:
            text = 'Starting database, wallet and BitTorrent node'
            break

        case LoadingState.OpeningApplicationDatabase:
            text = 'Opening the application database'
            break

        case LoadingState.InitializingSPVNode:
            text = 'Initializing SPV node'
            break

        case LoadingState.OpeningWallet:
            text = 'Opening wallet'
            break

        case LoadingState.ConnectingToBitcoinP2PNetwork:
            text = 'Connecting to Bitcoin peer network'
            break

        case LoadingState.LoadingTorrents:
            text = 'Loading torrents'
            break
    }

    return text
}

const LoadingScene = (props) => {

    let text = progressTextFromLoadingState(props.loadingState)
    let percentage = 100 * (props.loadingState + 1) / (Object.keys(LoadingState).length)

    return (
        <SplashProgress progressText={text}
                        progressPercentage={percentage}
        />

    )

}

LoadingScene.propTypes = {
    loadingState : PropTypes.oneOf(Object.values(LoadingState)),
}

export default LoadingScene
