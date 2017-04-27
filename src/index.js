// Use of pure js bcoin library because electron doesn't compile with openssl
// which is needed.
process.env.BCOIN_NO_NATIVE = '1'

// babel-polyfill for generator (async/await)
import 'babel-polyfill'
import bcoin from 'bcoin'
import path from 'path'
import os from 'os'
import { Session } from 'joystream-node'
import TorrentsStorage from './db/Torrents'
const constants = require('./constants')

// React
import React from 'react'
import ReactDOM from 'react-dom'

import WalletStore from './stores/walletStore'
import SessionStore from './stores/sessionStore'

// Main component
import Application from './scenes/Application'

// Disable workers which are not available in electron
bcoin.set({ useWorkers: false })

// Torrent content save path
const savePath = process.env.SAVE_PATH || path.join(os.homedir(), 'joystream', 'download', path.sep)

// Application database path
const dbPath = path.join(os.homedir(), 'joystream', 'data', path.sep)

let db = TorrentsStorage.open(dbPath, {
  // 'table' names to use
  'torrents': 'torrents',
  'resume_data': 'resume_data',
  'torrent_settings': 'torrent_settings'
})

db.on('error', function (err) {
  console.log(err)
})

// Create SPVNode
const spvnode = new bcoin.spvnode({
  prefix: __dirname,
  network: 'testnet',
  port: process.env.WALLET_PORT,
  plugins: ['walletdb'],
  loader: function (name) {
    if (name === 'walletdb') return bcoin.walletplugin
  }
})

spvnode.on('error', function (err) {
  console.log(err.message)
})

// Create joystream libtorrent session
const session = new Session({
  port: process.env.LIBTORRENT_PORT
})

// Create mobx session store
let sessionStore = new SessionStore({session, savePath, db})

// Request regular torrent state updates
setInterval(() => session.postTorrentUpdates(), constants.POST_TORRENT_UPDATES_INTERVAL)

// Load persisted torrents from database into session store
db.forEachTorrent(function (params) {
  sessionStore.loadTorrent(params).then((torrent) => {
    if (torrent) {
      // success loading torrent
    } else {
      // loading torrent failed
    }
  })
})

spvnode
  .open()
  .then(async function () {
    const wallet = await spvnode.plugins.walletdb.get('primary')
    await spvnode.connect()
    spvnode.startSync()
    return wallet
  }).then((wallet) => {
    return {
      walletStore: new WalletStore(wallet),
      sessionStore
    }
  }).then((stores) => {
    ReactDOM.render(
      <Application stores={stores} />,
      document.getElementById('root')
    )
  })
