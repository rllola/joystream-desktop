// Use of pure js bcoin library because electron doesn't compile with openssl
// which is needed.
process.env.BCOIN_NO_NATIVE = '1'

// babel-polyfill for generator (async/await)
import 'babel-polyfill'

import path from 'path'
import os from 'os'
import mkdirp from 'mkdirp'
import { Session } from 'joystream-node'
import TorrentsStorage from './db'
import bcoin from 'bcoin'

import ApplicationStore from './stores/applicationStore'

const constants = require('./constants')

// React
import React from 'react'
import ReactDOM from 'react-dom'

// Disable workers which are not available in electron
bcoin.set({ useWorkers: false })

// Create default application data directory
mkdirp.sync(path.join(os.homedir(), 'joystream'))

// Application database path
const dbPath = process.env.DATA_PATH || path.join(os.homedir(), 'joystream', 'data', path.sep)

const db = TorrentsStorage.open(dbPath, {
  // 'table' names to use
  'torrents': 'torrents',
  'resume_data': 'resume_data',
  'torrent_plugin_settings': 'torrent_plugin_settings'
})

// Path to bcoin databases (spvchain db and wallet db)
const walletPrefix = process.env.WALLET_PATH || path.join(os.homedir(), 'joystream', 'wallet')

// Create wallet directory
mkdirp.sync(walletPrefix)

// Create SPVNode
const spvnode = new bcoin.spvnode({
  prefix: walletPrefix,
  db: 'leveldb',
  network: 'testnet',
  port: process.env.WALLET_PORT,
  plugins: ['walletdb'],
  loader: function (name) {
    if (name === 'walletdb') return bcoin.walletplugin
  }/**,
  logger: new bcoin.logger({
    level: 'info'
  })*/
})

// Create joystream libtorrent session
const session = new Session({
  port: process.env.LIBTORRENT_PORT
})

// Torrent content save path
const savePath = process.env.SAVE_PATH || path.join(os.homedir(), 'joystream', 'download', path.sep)

// create ApplicationStore instance
const applicationStore = new ApplicationStore({session, savePath, spvnode, db})

function render (stores) {
  // NB: We have to re-require Application every time, or else this won't work
  const Application = require('./scenes/Application').default

  if (process.env.NODE_ENV === 'development') {

    const AppContainer = require('react-hot-loader').AppContainer

    ReactDOM.render(
      <AppContainer>
        <Application stores={stores} />
      </AppContainer>
      ,
      document.getElementById('root')
    )
  } else {
    ReactDOM.render(
      <Application stores={stores} />,
      document.getElementById('root')
    )
  }
}

if (module.hot) {
  module.hot.accept(render.bind(null, applicationStore.stores))
}

render(applicationStore.stores)

applicationStore.start()

function logError (err) {
  console.error(err.message)
}

// Error logging
db.on('error', logError)
session.on('error', logError)
spvnode.on('error', logError)
applicationStore.on('error', logError)
