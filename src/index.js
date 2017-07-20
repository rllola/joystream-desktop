// Use of pure js bcoin library because electron doesn't compile with openssl
// which is needed.
process.env.BCOIN_NO_NATIVE = '1'

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
