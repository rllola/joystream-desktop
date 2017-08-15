import React, { Component } from 'react'
import { observer } from 'mobx-react'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

//import Header from '../Header'
import Header from '../../components/Header'
import Scene from '../../core/Application/Scene'

// Components
//import Sidebar from './components/Sidebar'

// Our scenes
import Loading, {LoadingState} from '../Loading/LoadingScene'
import Terminating, {TerminatingState} from '../Terminating'
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

        console.log('Application.render()')

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

        switch(this.props.store.activeScene) {

            case Scene.NotStarted:
                return <h1>NotStarted</h1>

            case Scene.Loading:
                return <Loading loadingState={applicationStateToLoadingState(this.props.store.state)}
                                loadingTorrentsProgressValue={100*this.props.store.torrentLoadingProgress}/>

            case Scene.Downloading:
                return <NavigationFrame {...this.props}>
<<<<<<< HEAD
                            <Downloading torrents={this.props.store._torrentsDownloading}
                                         revenue={this.props.store.revenue}
                                         downloadSpeed={this.props.store.totalDownloadRate}
                                         onStartDownloadClicked={() => {this.props.store.startDownload()}}
                                         state={this.props.store.state}
                                         torrentsBeingLoaded={this.props.store.torrentsBeingLoaded}
                                         store = {this.props.store}
                            />
=======
                            <Downloading torrents={this.props.app.torrentsDownloading}
                                                 revenue={123}
                                                 downloadSpeed={77777}
                                                 onStartDownloadClicked={() => { console.log(" start download clicked")}}/>
>>>>>>> Relocating and updating header components
                        </NavigationFrame>

            case Scene.Uploading:
                return <NavigationFrame {...this.props}>
<<<<<<< HEAD
                          <Seeding torrents={this.props.store._torrentsUploading}
=======
                          <Seeding torrents={this.props.app.torrentsUploading}
>>>>>>> Relocating and updating header components
                                revenue={123}
                                uploadSpeed={77777}
                                onStartUploadCliked={() => {console.log(" start uploading clicked")}} />
                        </NavigationFrame>

            case Scene.Completed:
                return <NavigationFrame {...this.props}>
<<<<<<< HEAD
                            <Completed torrents={this.props.store._torrentsCompleted} />
=======
                            <Completed torrents={this.props.app.torrentsCompleted} />
>>>>>>> Relocating and updating header components
                        </NavigationFrame>

            case Scene.ShuttingDown:

                return <Terminating terminatingState={applicationStateToTerminatingState(this.props.store.state)}
                                    terminatingTorrentsProgressValue={100*(this.props.store.torrentTerminatingProgress/this.props.store.torrentsToTerminate)} />
        }
    }

}

Application.propTypes = {

}

const NavigationFrame = (props) => {

    return (
        <div className="navigation-frame-container">

<<<<<<< HEAD
            <ApplicationHeader balance={props.store.unconfirmedBalance}
                               activeScene={props.store.activeScene}
                               onSceneSelected={(s) => {props.store.moveToScene(s)}}/>
=======
            <Header app={props.app}/>
>>>>>>> Relocating and updating header components

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

function applicationStateToTerminatingState(s) {

    let terminatingState

    if(s == "Stopping.TerminatingTorrents" || s == "Stopping.SavingTorrentsToDatabase" || s == "Stopping.uninitialized")
        terminatingState = TerminatingState.TerminatingTorrents
    else if(s == "Stopping.DisconnectingFromBitcoinNetwork")
        terminatingState = TerminatingState.DisconnectingFromBitcoinNetwork
    else if(s == "Stopping.ClosingWallet")
        terminatingState = TerminatingState.ClosingWallet
    else if(s == "Stopping.StoppingSpvNode")
        terminatingState = TerminatingState.StoppingSpvNode
    else if(s == "Stopping.ClosingApplicationDatabase")
        terminatingState = TerminatingState.ClosingApplicationDatabase
    else if(s == "Stopping.ClearingResources")
        terminatingState = TerminatingState.ClearingResources

    return terminatingState
}

export default Application
