import React, { Component } from 'react'
import { observer } from 'mobx-react'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

//import Header from '../Header'
import ApplicationHeader from './ApplicationHeader'
import Scene from '../../core/Application/Scene'

// Components
//import Sidebar from './components/Sidebar'

// Our scenes
import Loading, {LoadingState} from '../Loading/LoadingScene'
import Downloading from '../Downloading'
import Seeding from '../Seeding'
import Completed from '../Completed'
//import Wallet from '../Wallet'

let MobxReactDevTools
if (process.env.NODE_ENV === 'development') {
    MobxReactDevTools = require('mobx-react-devtools').default
}

@observer
class Application extends Component {

    constructor(props) {
        super(props)
    }

    render () {

        return(
            <MuiThemeProvider>
                <div className="app-container">
                    {this.renderActiveScene()}
                    {process.env.NODE_ENV === 'development' ? <div><MobxReactDevTools/></div> : null}
                </div>
            </MuiThemeProvider>
        )
    }

    renderActiveScene() {

        switch(this.props.app.activeScene) {

            case Scene.NotStarted:
                return null

            case Scene.Loading:
                return <Loading loadingState={applicationStateToLoadingState(this.props.app.state)}
                                loadingTorrentsProgressValue={100*(this.props.app.torrentLoadingProgress/this.props.app.torrentsToLoad)}/>

            case Scene.Downloading:
                return <NavigationFrame {...this.props}>
                            <Downloading torrents={this.props.app._torrentsDownloading}
                                                 revenue={123}
                                                 downloadSpeed={77777}
                                                 onStartDownloadClicked={() => { console.log(" start download clicked")}}/>
                        </NavigationFrame>

            case Scene.Uploading:
                return <NavigationFrame {...this.props}>
                            <h1>put new uploading scene component here</h1>
                        </NavigationFrame>

            case Scene.Completed:
                return <NavigationFrame {...this.props}>
                            <h1>put new completed scene component here</h1>
                        </NavigationFrame>

            case Scene.ShuttingDown:
                return <h1>Shutting down . . .</h1>
        }
    }

}

const NavigationFrame = (props) => {

    return (
        <div className="navigation-frame-container">

            <ApplicationHeader balance={13333337}
                               activeScene={props.app.activeScene}
                               onSceneSelected={(s) => {props.app.moveToScene(s)}}/>

            {props.children}
        </div>
    )
}

function applicationStateToLoadingState(s) {

    let loadingState

    if(s == "Starting.InitializingResources" || s == "Starting.NotStarted")
        loadingState = LoadingState.InitializingResources
    else if(s== "Starting.initializingApplicationDatabase")
        loadingState = LoadingState.OpeningApplicationDatabase
    else if(s== "Starting.InitialializingSpvNode")
        loadingState = LoadingState.InitializingSPVNode
    else if(s == "Starting.OpeningWallet")
        loadingState = LoadingState.OpeningWallet
    else if(s == "Starting.ConnectingToBitcoinP2PNetwork")
        loadingState = LoadingState.ConnectingToBitcoinP2PNetwork
    else if(s.startsWith("Starting.LoadingTorrents"))
        loadingState = LoadingState.LoadingTorrents

    return loadingState
}

export default Application
