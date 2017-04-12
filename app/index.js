// babel-polyfill for generator (async/await)
import 'babel-polyfill'
import 'bcoin'
import path from 'path'
import os from 'os'
import WalletStore from './stores/Wallet.js'
import SessionStore from './stores/Session.js'
import { Session } from 'joystream-node'

// React
import React from 'react'
import ReactDOM from 'react-dom'

// Main component
import App from './App'

console.log(process.env.PORT)
console.log(process.env.SAVE_PATH)

// Torrent content save path
const savePath = process.env.SAVE_PATH || path.join(os.homedir(), 'joystream','download', path.sep)

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


spvnode.open()
  .then(async function() {
    console.log('spvnode opened')
    spvnode.connect()

    const wallet = await spvnode.plugins.walletdb.get('primary')

    const stores = {
        walletStore: new WalletStore(wallet),
        sessionStore: new SessionStore({session, savePath})
    }

    ReactDOM.render(
      <App stores={stores}/>,
      document.getElementById('root')
    )
})
