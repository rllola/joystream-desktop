/**
 * Created by bedeho on 06/10/2017.
 */

import React from 'react'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'

import FullScreenContainer from '../../../components/FullScreenContainer'
import {OnboardingStore} from '../../../core'
import DepartureScreenContent from './DepartureScreenContent'

const DepartureScreen = observer((props) => {

    return (
        props.store.onboardingStore &&
        props.store.onboardingStore.state === OnboardingStore.State.DepartureScreen
            ?
            <FullScreenContainer>
                <DepartureScreenContent onboardingStore={props.store.onboardingStore} />
            </FullScreenContainer>
            :
            null
    )

})

DepartureScreen.propTypes = {
    store : PropTypes.object.isRequired
}

export default DepartureScreen