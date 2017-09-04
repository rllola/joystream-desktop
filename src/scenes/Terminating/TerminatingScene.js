/**
 * Created by bedeho on 25/07/17.
 */

import React from 'react'
import PropTypes from 'prop-types'
import {
    Step,
    Stepper,
    StepLabel,
    StepContent,
} from 'material-ui/Stepper'
import LinearProgress from 'material-ui/LinearProgress'
import TerminatingState from './TerminatingState'

const TerminatingProgressIndicator = (props) => {

    return (
        <Stepper
            activeStep={props.terminatingState}
            orientation="vertical"
            connector={null}>

            <Step>
                <StepLabel>Terminating torrents</StepLabel>
                <StepContent>
                    <LinearProgress mode="determinate" value={props.terminatingTorrentsProgressValue} />
                </StepContent>
            </Step>

            <Step>
                <StepLabel>Disconnecting from Bitcoin peer network</StepLabel>
            </Step>

            <Step>
                <StepLabel>Closing wallet</StepLabel>
            </Step>

            <Step>
                <StepLabel>Stopping Bitcoin SPV node</StepLabel>
            </Step>

            <Step>
                <StepLabel>Closing application database</StepLabel>
            </Step>

            <Step>
                <StepLabel>Clearing resources</StepLabel>
            </Step>
        </Stepper>
    )
}

const TerminatingScene = (props) => {

    return (
        <div className="LoadingScene">
            <div className="CenterPiece">
                <h1>logo</h1>
                <TerminatingProgressIndicator {...props}/>
            </div>
        </div>
    )
}

TerminatingScene.propTypes = {
    terminatingState : PropTypes.oneOf(Object.values(TerminatingState)),
    terminatingTorrentsProgressValue : PropTypes.number
}

export default TerminatingScene