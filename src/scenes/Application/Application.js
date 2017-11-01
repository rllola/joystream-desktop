import React, { Component } from 'react'
import { Provider, observer } from 'mobx-react'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
const isDev = require('electron-is-dev')

import Scene from '../../core/Application/Scene'

// Components
import ApplicationHeader from './components/ApplicationHeader'
import ApplicationStatusBar from './components/ApplicationStatusBar'
import VideoPlayer from '../../components/VideoPlayer'

import {UI_CONSTANTS} from '../../constants'

// Our scenes
import NotStartedScene from '../NotStarted'
import LoadingScene, {LoadingState} from '../Loading'
import TerminatingScene, {TerminatingState} from '../Terminating'
import Downloading from '../Downloading'
import Seeding from '../Seeding'
import Completed from '../Completed'
import Community from '../Community'
import VideoPlayerScene from '../VideoPlayer'

//import Wallet from '../Wallet'
import {WelcomeScreen, DepartureScreen} from '../OnBoarding'

let MobxReactDevTools = require('mobx-react-devtools').default

function getStyles(props) {

    return {
        innerRoot : {
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
        }
    }
}

@observer
class Application extends Component {

    constructor(props) {
        super(props)
    }

    render () {

        let styles = getStyles(this.props)

        return (
            <MuiThemeProvider>
                <Provider uiConstantsStore={UI_CONSTANTS}>
                    <div style={styles.innerRoot}>

                        { /* Onboarding scenes */ }

                        <WelcomeScreen store={this.props.store} />
                        <DepartureScreen store={this.props.store} />

                        <ApplicationStatusBar store={this.props.store} />

                        <VideoPlayerScene store={this.props.store}/>

                        { this.renderActiveScene() }

                        {
                                isDev
                            ?
                                <div><MobxReactDevTools/></div>
                            :
                                null
                        }

                    </div>
                </Provider>
            </MuiThemeProvider>
        )
    }

    renderActiveScene() {

        let middleSectionColorProps = {
            middleSectionBaseColor : UI_CONSTANTS.primaryColor,
            middleSectionDarkBaseColor : UI_CONSTANTS.darkPrimaryColor,
            middleSectionHighlightColor :UI_CONSTANTS.higlightColor
        }

        switch(this.props.store.activeScene) {

            case Scene.NotStarted:
                return <NotStartedScene />

            case Scene.Loading:

                return <LoadingScene show={this.props.store.activeScene === Scene.Loading}
                                     loadingState={applicationStateToLoadingState(this.props.store.state)}/>
            case Scene.Downloading:
                return <NavigationFrame app={this.props.store}>
                            <Downloading torrents={this.props.store.torrentsDownloading}
                                         spending={this.props.store.totalSpent}
                                         downloadSpeed={this.props.store.totalDownloadSpeed}
                                         onStartDownloadClicked={() => {this.props.store.startDownloadWithTorrentFileFromFilePicker()}}
                                         onStartDownloadDrop={(files) => {this.props.store.startDownloadWithTorrentFileFromDragAndDrop(files)}}
                                         state={this.props.store.state}
                                         torrentsBeingLoaded={this.props.store.torrentsBeingLoaded}
                                         store={this.props.store}
                                         {...middleSectionColorProps}
                            />
                        </NavigationFrame>

            case Scene.Uploading:

                return <NavigationFrame app={this.props.store}>

                          <Seeding store={this.props.store}
                                   {...middleSectionColorProps}
                          />
                        </NavigationFrame>

            case Scene.Completed:

                return <NavigationFrame app={this.props.store}>
                            <Completed store={this.props.store}
                                       {...middleSectionColorProps}
                            />
                        </NavigationFrame>

            case Scene.Community:

                return <NavigationFrame app={this.props.store}>
                            <Community store={this.props.store}
                                       backgroundColor={UI_CONSTANTS.primaryColor}
                            />
                        </NavigationFrame>

            case Scene.ShuttingDown:

                return <TerminatingScene show={this.props.store.activeScene === Scene.ShuttingDown}
                                         terminatingState={applicationStateToTerminatingState(this.props.store.state)}
                                         terminatingTorrentsProgressValue={100*(this.props.store.torrentTerminatingProgress/this.props.store.torrentsToTerminate)} />

            default:
                return null
        }
    }
}

Application.propTypes = {

}

const NavigationFrame = observer((props) => {

    let style = {
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1
    }

    return (
        <div style={style}>
            <ApplicationHeader app={props.app}
                               height={'90px'}
                               accentColor={UI_CONSTANTS.primaryColor}
                                />
            {props.children}
        </div>
    )
})

function applicationStateToLoadingState(s) {

    let loadingState

    if(s === "Starting.uninitialized" || s === "Starting.InitializingResources" || s === "Starting.NotStarted")
        loadingState = LoadingState.InitializingResources
    else if(s === "Starting.initializingApplicationDatabase")
        loadingState = LoadingState.OpeningApplicationDatabase
    else if(s === "Starting.InitialializingSpvNode")
        loadingState = LoadingState.InitializingSPVNode
    else if(s === "Starting.OpeningWallet")
        loadingState = LoadingState.OpeningWallet
    else if(s === "Starting.ConnectingToBitcoinP2PNetwork")
        loadingState = LoadingState.ConnectingToBitcoinP2PNetwork
    else if(s.startsWith("Starting.LoadingTorrents"))
        loadingState = LoadingState.LoadingTorrents

    return loadingState
}

function applicationStateToTerminatingState(s) {

    let terminatingState

    if(s === "Stopping.TerminatingTorrents" || s === "Stopping.SavingTorrentsToDatabase" || s === "Stopping.uninitialized")
        terminatingState = TerminatingState.TerminatingTorrents
    else if(s === "Stopping.DisconnectingFromBitcoinNetwork")
        terminatingState = TerminatingState.DisconnectingFromBitcoinNetwork
    else if(s === "Stopping.ClosingWallet")
        terminatingState = TerminatingState.ClosingWallet
    else if(s === "Stopping.StoppingSpvNode")
        terminatingState = TerminatingState.StoppingSpvNode
    else if(s === "Stopping.ClosingApplicationDatabase")
        terminatingState = TerminatingState.ClosingApplicationDatabase
    else if(s === "Stopping.ClearingResources")
        terminatingState = TerminatingState.ClearingResources

    return terminatingState
}

export default Application
