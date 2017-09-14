import React from 'react'
import {ScenarioContainer} from '../common'
import OnBoarding from '../../scenes/OnBoarding'

const OnBoardingScenario = () => {
  var style = {
    height: '600'
  }
  return (
    <ScenarioContainer title="On Boarding information message">
      <div style={style} >
        <OnBoarding onDoneClick={() => { console.log('Done')}} />
      </div>
    </ScenarioContainer>
  )
}

export default OnBoardingScenario
