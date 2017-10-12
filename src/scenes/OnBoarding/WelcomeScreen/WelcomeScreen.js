/**
 * Created by bedeho on 04/10/17.
 */

import React from 'react'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'

import FullScreenContainer from '../../../components/FullScreenContainer'
import {OnboardingStore} from '../../../core'
import WelcomeScreenContent from './WelcomeScreenContent'

const WelcomeScreen = observer((props) => {

    return (
        props.store.onboardingStore &&
        props.store.onboardingStore.state === OnboardingStore.State.WelcomeScreen
            ?
        <FullScreenContainer>
            <WelcomeScreenContent onboardingStore={props.store.onboardingStore} />
        </FullScreenContainer>
            :
        null
    )

})

WelcomeScreen.propTypes = {
    store : PropTypes.object.isRequired
}

export default WelcomeScreen