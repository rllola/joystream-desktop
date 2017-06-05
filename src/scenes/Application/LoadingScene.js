/**
 * Created by bedeho on 02/06/17.
 */

import React from 'react'
import PropTypes from 'prop-types'
import {
    Step,
    Stepper,
    StepLabel,
    StepContent,
} from 'material-ui/Stepper';

// Move this into the ?
// which step can fail?
// which needs richer state?
var LoadingState = {
    CreatingSPVNode : 0,
    CreateSession : 1,
    InitializingSPVNode : 2,
    OpeningWallet : 3,
    ConnectingToBitcoinP2PNetwork : 4,
    LoadingTorrents : 5,
    Finished : 6
}

const LoadingScene = (props) => {

    return (
        <div style={{maxWidth: 380, maxHeight: 400, margin: 'auto'}}>
            <Stepper activeStep={props.state} orientation="vertical">
                <Step>
                    <StepLabel>Creating SPV Node</StepLabel>
                </Step>
                <Step>
                    <StepLabel>Starting BitTorrent session</StepLabel>
                </Step>
                <Step>
                    <StepLabel>Opening Wallet</StepLabel>
                </Step>
                <Step>
                    <StepLabel>Connecting to Bitcoin peer network</StepLabel>
                </Step>
                <Step>
                    <StepLabel>Loading torrents</StepLabel>
                    <StepContent>
                        <p>
                            Try out different ad text to see what brings in the most customers,
                            and learn how to enhance your ads using features like ad extensions.
                            If you run into any problems with your ads, find out how to tell if
                            they're running and how to resolve approval issues.
                        </p>
                    </StepContent>
                </Step>
                <Step>
                    <StepLabel>Finished</StepLabel>
                </Step>
            </Stepper>
        </div>
    )

}

/*
<StepContent>
    <p>
        Try out different ad text to see what brings in the most customers,
        and learn how to enhance your ads using features like ad extensions.
        If you run into any problems with your ads, find out how to tell if
        they're running and how to resolve approval issues.
    </p>
</StepContent>
*/

LoadingScene.propTypes = {
    state : PropTypes.oneOf(Object.values(LoadingState))

}

export {LoadingState}
export default LoadingScene
