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
} from 'material-ui/Stepper'
import LinearProgress from 'material-ui/LinearProgress'

// Move this into the ?
// which step can fail?
// which needs richer state?
var LoadingState = {
    InitializingResources : 0,
    OpeningApplicationDatabase : 1,
    InitializingSPVNode : 2,
    OpeningWallet : 3,
    ConnectingToBitcoinP2PNetwork : 4,
    LoadingTorrents : 5
}

// initializing_resources => (create) dirs, spv, session
// (open)/initializing_application_database =>
// initializeSpvNode
// opening_wallet
// connecting_to_bitcoin_p2p_network


const LoadingProgressIndicator = (props) => {

  return (
      <Stepper
      activeStep={props.loadingState}
      orientation="vertical"
      connector={null}>
          <Step>
              <StepLabel>Initializing resources</StepLabel>
          </Step>
          <Step>
              <StepLabel>Opening application database</StepLabel>
          </Step>
          <Step>
              <StepLabel>Initializing Bitcoin SPV node</StepLabel>
          </Step>
          <Step>
              <StepLabel>Opening wallet</StepLabel>
          </Step>
          <Step>
              <StepLabel>Connecting to Bitcoin peer network</StepLabel>
          </Step>
          {
              /*
              <Step>
                  <StepLabel>Loading torrents</StepLabel>
                  <StepContent>
                      <LinearProgress mode="determinate" value={props.loadingTorrentsProgressValue}/>
                  </StepContent>
              </Step>
                */
          }
      </Stepper>
  )
}

const LoadingScene = (props) => {

    return (
      <div className="LoadingScene">
        <div className="CenterPiece">
            <h1>logo</h1>
            <LoadingProgressIndicator {...props}/>
        </div>
      </div>
    )
}

LoadingScene.propTypes = {
    loadingState : PropTypes.oneOf(Object.values(LoadingState)),
    loadingTorrentsProgressValue : PropTypes.number
}

export {LoadingState}
export default LoadingScene
