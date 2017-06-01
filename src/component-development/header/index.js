/**
 * Created by bedeho on 29/05/17.
 */

import React from 'react'
import { HashRouter, Route } from 'react-router-dom'

import {ScenarioContainer} from '../common'

import {Scene, ApplicationHeader} from '../../scenes/Application'

// factor out logo image thing => // change actual image logo?

const HeaderScenarios = () => {

    return (
        <div>

            <ScenarioContainer title="Normal" subtitle="normal">
                <ApplicationHeader balance={813890}
                                   onSceneSelected={(e) => { console.log("selected scene: " + e)}}
                                   activeScene={Scene.Downloading}/>
            </ScenarioContainer>

        </div>
    )
}

export default HeaderScenarios