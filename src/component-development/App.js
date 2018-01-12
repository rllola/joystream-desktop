import React from 'react'
import { HashRouter, Route } from 'react-router-dom'
import { Link } from 'react-router-dom'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import RaisedButton from 'material-ui/RaisedButton'

import Application from '../scenes/Application'
import AlertDialog from './AlertDialog'
import Downloading from './downloading'
import LoadingSceneScenarios from './loading'
import TerminatingSceneScenarios from './terminating'
import StreamScenarios from './stream'
import Seeding from './seeding'
import Completed from './completed'
import StartDownloadingFlowScenarios from './startDownloadingFlow'
import ApplicationHeaderScenarios from './ApplicationHeader'
import Onboarding from './onboarding'
import ControllableApplicationStatusBar from './ApplicationStatusBar'
import NotificationScenarios from './Notification'

import UpdaterFlow, {UpdaterLauncher} from './Updater'
import ControllableFullScreenDialog from './FullScreenDialog'
import ElevatedAutoLitButtonScenarios from './ElevatedAutoLitButton'

// Workaround to get props passed to `Application` component when used with `Route`
const ComponentWithStoreProp = (component, props) => {

    return () => {

        return React.createElement(
            component,
            props
        )
        /** (
            <component store={applicationStore}/>
        ) **/

    }
}

const App = (props) => {

    const style = {
        margin: 20,
    }

    return (
        <MuiThemeProvider>
            <div style={{padding: 20}}>
                <h1>Component Development</h1>

                <HashRouter>
                    <div>
                        <Link to="application"> <RaisedButton label="Application" style={style} /> </Link>
                        <Link to="alertDialog"> <RaisedButton label="Alert Dialog" style={style} /> </Link>
                        <Link to="loading"> <RaisedButton label="Loading" style={style} /> </Link>
                        <Link to="terminating"> <RaisedButton label="Terminating" style={style} /> </Link>
                        <Link to="downloading"> <RaisedButton label="Downloading" style={style} />  </Link>
                        <Link to="completed"> <RaisedButton label="Completed" style={style} /> </Link>
                        <Link to="seeding"> <RaisedButton label="Seeding" style={style} /> </Link>
                        <Link to="stream"> <RaisedButton label="Stream" style={style} /> </Link>
                        <Link to="start_downloading_flow"> <RaisedButton label="Start Downloading Flow" style={style} /> </Link>
                        <Link to="application_header"> <RaisedButton label="Application Header" style={style} /> </Link>
                        <Link to="auto_updater"> <RaisedButton label="AutoUpdater Window" style={style} /> </Link>
                        <Link to="update_launcher"> <RaisedButton label="Separate autoUpdater Window" style={style} /> </Link>
                        <Link to="full_screen_dialog"> <RaisedButton label="Full screen dialog" style={style} /> </Link>
                        <Link to="elevated_auto_lit_button"> <RaisedButton label="Elevated auto lit button" style={style} /> </Link>
                        <Link to="onboarding"> <RaisedButton label="Onboarding" style={style} /> </Link>
                        <Link to="application_status_bar"> <RaisedButton label="ApplicationStatusBar" style={style} /> </Link>
                        <Link to="notification"> <RaisedButton label="Notification" style={style} /> </Link>

                        <hr/>

                        <Route path="/application" component={ComponentWithStoreProp(Application, props)} />
                        <Route path="/alertDialog" component={AlertDialog} />
                        <Route path="/loading" component={LoadingSceneScenarios} />
                        <Route path="/terminating" component={TerminatingSceneScenarios} />
                        <Route path="/downloading" component={Downloading} />
                        <Route path="/completed" component={Completed}/>
                        <Route path="/seeding" component={Seeding}/>
                        <Route path="/stream" component={StreamScenarios} />
                        <Route path="/start_downloading_flow" component={ComponentWithStoreProp(StartDownloadingFlowScenarios, props)} />
                        <Route path="/application_header" component={ComponentWithStoreProp(ApplicationHeaderScenarios, props)} />
                        <Route path="/auto_updater" component={UpdaterFlow} />
                        <Route path="/update_launcher" component={UpdaterLauncher} />
                        <Route path="/full_screen_dialog" component={ControllableFullScreenDialog} />
                        <Route path="/elevated_auto_lit_button" component={ElevatedAutoLitButtonScenarios} />
                        <Route path="/start_downloading_flow" component={StartDownloadingFlowScenarios} />
                        <Route path="/application_header" component={ApplicationHeaderScenarios} />
                        <Route path="/onboarding" component={Onboarding} />
                        <Route path="/application_status_bar" component={ControllableApplicationStatusBar} />
                        <Route path="/notification" component={NotificationScenarios} />

                    </div>
                </HashRouter>

            </div>
        </MuiThemeProvider>
    )
}

export default App
