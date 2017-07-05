import React from 'react'
import { HashRouter, Route } from 'react-router-dom'
import { Link } from 'react-router-dom'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import RaisedButton from 'material-ui/RaisedButton'

import HeaderScenarios from './header'
import Downloading from './downloading'
import LoadingSceneScenarios from './loading'
import TerminatingSceneScenarios from './terminating'
import StreamScenario from './stream'

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

                        <Route path="/loading" component={LoadingSceneScenarios} />
                        <Route path="/terminating" component={TerminatingSceneScenarios} />
                        <Route path="/header" component={HeaderScenarios} />
                        <Route path="/downloading" component={Downloading} />
                        <Route path="/completed" />
                        <Route path="/seeding" />
                        <Route path="/stream" component={StreamScenario} />
                    </div>
                </HashRouter>
            </div>
        </MuiThemeProvider>
    )
}

export default App
