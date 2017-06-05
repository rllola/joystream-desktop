/**
 * Created by bedeho on 03/06/17.
 */

import React, {Component} from 'react'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton'

import {ScenarioContainer} from '../common'
import LoadingScene,{LoadingState} from '../../scenes/Application/LoadingScene'


function getState(s) {
    return { 'loadingState' : LoadingState.CreatingSPVNode }
}

class ControllableLoadingScene extends Component {

    constructor(props) {
        super(props)

        this.state = getState(LoadingState.CreatingSPVNode)
    }

    goToNextState() {

        if(this.state.loadingState == LoadingState.Finished)
            throw Error('Already at last state')
        else
            this.setState(getState(this.state.loadingState + 1)) // a bit sloppy, but OK, later add more sophistication
    }

    goToPriorState() {

        if(this.state.loadingState == LoadingState.CreatingSPVNode)
            throw Error('Already at first state')
        else
            this.setState(getState(this.state.loadingState - 1)) // a bit sloppy, but OK, later add more sophistication
    }

    render() {

        return (
            <div>
                <LoadingScene state={this.state.loadingState}/>
                <CardActions>
                    <FlatButton label="Next" onTouchTap={() => { this.goToNextState()}}/>
                    <FlatButton label="Previous" onTouchTap={() => { this.goToPriorState()}}/>
                </CardActions>
            </div>
        )
    }

}

const LoadingSceneScenarios = () => {

    return (
        <ScenarioContainer>
            <ControllableLoadingScene />

        </ScenarioContainer>
    )
}

export default LoadingSceneScenarios