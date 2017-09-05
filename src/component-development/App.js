import React from 'react'
import { HashRouter, Route } from 'react-router-dom'
import { Link } from 'react-router-dom'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import RaisedButton from 'material-ui/RaisedButton'

import Downloading from './downloading'
import LoadingSceneScenarios from './loading'
import TerminatingSceneScenarios from './terminating'
import StreamScenario from './stream'
import Seeding from './seeding'
import Completed from './completed'
import StartDownloadingFlowScenarios from './startDownloadingFlow'
import ApplicationHeaderScenarios from './ApplicationHeader'

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
                        <Link to="loading"> <RaisedButton label="Loading" style={style} /> </Link>
                        <Link to="terminating"> <RaisedButton label="Terminating" style={style} /> </Link>
                        <Link to="header"> <RaisedButton label="Header" style={style} />  </Link>
                        <Link to="downloading"> <RaisedButton label="Downloading" style={style} />  </Link>
                        <Link to="completed"> <RaisedButton label="Completed" style={style} /> </Link>
                        <Link to="seeding"> <RaisedButton label="Seeding" style={style} /> </Link>
                        <Link to="stream"> <RaisedButton label="Stream" style={style} /> </Link>
                        <Link to="start_downloading_flow"> <RaisedButton label="Start Downloading Flow" style={style} /> </Link>
                        <Link to="application_header"> <RaisedButton label="Application Header" style={style} /> </Link>

                        <hr/>

                        <Route path="/loading" component={LoadingSceneScenarios} />
                        <Route path="/terminating" component={TerminatingSceneScenarios} />
                        <Route path="/downloading" component={Downloading} />
                        <Route path="/completed" component={Completed}/>
                        <Route path="/seeding" component={Seeding}/>
                        <Route path="/stream" component={StreamScenario} />
                        <Route path="/start_downloading_flow" component={StartDownloadingFlowScenarios} />
                        <Route path="/application_header" component={ApplicationHeaderScenarios} />
                    </div>
                </HashRouter>

            </div>
        </MuiThemeProvider>
    )
}

export default App
