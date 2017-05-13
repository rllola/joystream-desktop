import React, { Component } from 'react'
import { HashRouter, Route } from 'react-router-dom'
import { Link } from 'react-router-dom'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import RaisedButton from 'material-ui/RaisedButton'

import Downloading from './downloading'

const App = (props) => {

    const style = {
        margin: 12,
    }

    return (
        <MuiThemeProvider>
            <div style={{padding: 20}}>
                <h1>Component Development</h1>

                <HashRouter>
                    <div>
                        <Link to="downloading"> <RaisedButton label="Downloading" style={style} />  </Link>
                        <Link to="completed"> <RaisedButton label="Completed" style={style} /> </Link>
                        <Link to="seeding"> <RaisedButton label="Seeding" style={style} /> </Link>

                        <Route path="/downloading" component={Downloading} />
                        <Route path="/completed" />
                        <Route path="/seeding" />
                    </div>
                </HashRouter>
            </div>
        </MuiThemeProvider>
    )
}

export default App