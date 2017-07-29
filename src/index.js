// Use of pure js bcoin library because electron doesn't compile with openssl
// which is needed.
process.env.BCOIN_NO_NATIVE = '1'

// Disable workers which are not available in electron
require('bcoin').set({ useWorkers: false })
import {ipcRenderer} from 'electron'

// babel-polyfill for generator (async/await)
import 'babel-polyfill'

import os from 'os'
import path from 'path'
//import Config from 'electron-config'

// React
import React from 'react'
import ReactDOM from 'react-dom'

import Application from './core/Application'

const application = new Application()

function render (app) {
  // NB: We have to re-require Application every time, or else this won't work
  const ApplicationScene = require('./scenes/Application').default

  if (process.env.NODE_ENV === 'development') {
    const AppContainer = require('react-hot-loader').AppContainer

    ReactDOM.render(
      <AppContainer>
        <ApplicationScene app={app} />
      </AppContainer>
      ,
      document.getElementById('root')
    )
  } else {
    ReactDOM.render(
      <ApplicationScene app={app} />,
      document.getElementById('root')
    )
  }
}

if (module.hot) {
  module.hot.accept(render.bind(null, application.store))
}

render(application.store)

//const config = new Config()
var config = {
  appDirectory: path.join(os.homedir(), 'joystream'),
  network: 'testnet',
  //logLevel: 'info'
}

application.start(config)

// ** Hook into close event for window **
// Unlike usual browsers that a message box will be prompted to users, returning
// a non-void value will silently cancel the close.
// It is recommended to use the dialog API to let the user confirm closing the
// application.
// NB: Be aware that when electron.app.quit is called, this callback will
// be triggered yet another time
window.onbeforeunload = function(e) {

    console.log('onbeforeunload')

    // Tell state machine
    application.onBeforeUnloadMainWindow(e)

    return
}
