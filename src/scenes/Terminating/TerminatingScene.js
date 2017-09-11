/**
 * Created by bedeho on 25/07/17.
 */

import React from 'react'
import PropTypes from 'prop-types'
import TerminatingState from './TerminatingState'
import SplashProgress from '../../components/SplashProgress'

function progressTextFromTerminatingState(state) {

    let text = null

    switch(state) {

        case TerminatingState.TerminatingTorrents:
            text = 'Stopping and storing torrents'
            break

        case TerminatingState.DisconnectingFromBitcoinNetwork:
            text = 'Disconnecting from Bitcoin peer network'
            break

        case TerminatingState.ClosingWallet:
            text = 'Closing wallet'
            break

        case TerminatingState.StoppingSpvNode:
            text = 'Stopping SPV node'
            break

        case TerminatingState.ClosingApplicationDatabase:
            text = 'Closing the application database'
            break

        case TerminatingState.ClearingResources:
            text = 'Stopping database, wallet and BitTorrent node'
            break
    }

    return text
}


const TerminatingScene = (props) => {

    let text = progressTextFromTerminatingState(props.terminatingState)
    let percentage = 100 * (props.terminatingState + 1) / (Object.keys(TerminatingState).length)

    return (
        <SplashProgress progressText={text}
                        progressPercentage={percentage}
        />

    )
}

TerminatingScene.propTypes = {
    terminatingState : PropTypes.oneOf(Object.values(TerminatingState)),
}

export default TerminatingScene