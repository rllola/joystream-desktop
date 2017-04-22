// babel-polyfill for generator (async/await)
import 'babel-polyfill'
import bcoin from 'bcoin'
import path from 'path'
import os from 'os'
import { Session } from 'joystream-node'

// React
import React from 'react'
import ReactDOM from 'react-dom'

import WalletStore from './stores/walletStore'
import SessionStore from './stores/sessionStore'

// Main component
import Application from './scenes/Application'

// Disable workers which are not available in electron
bcoin.set({ useWorkers: false })

// Use of pure js bcoin library because electron doesn't compile with openssl
// which is needed.
process.env.BCOIN_NO_NATIVE = '1'

// Torrent content save path
const savePath = process.env.SAVE_PATH || path.join(os.homedir(), 'joystream', 'download', path.sep)

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

spvnode
  .open()
  .then(async function () {
    console.log('spvnode opened')
    spvnode.connect()

    const wallet = await spvnode.plugins.walletdb.get('primary')

    const stores = {
      walletStore: new WalletStore(wallet),
      sessionStore: new SessionStore({session, savePath})
    }

    ReactDOM.render(
      <Application stores={stores} />,
      document.getElementById('root')
    )
})
