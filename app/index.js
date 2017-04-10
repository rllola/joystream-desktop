// babel-polyfill for generator (async/await)
import 'babel-polyfill'
import 'bcoin'
import WalletStore from './stores/Wallet.js'
import JoystreamStore from './stores/Joystream.js'
import { Session } from 'joystream-node'

// React
import React from 'react'
import ReactDOM from 'react-dom'

// Main component
import App from './App'

console.log(process.env.PORT)
console.log(process.env.SAVE_PATH)

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


spvnode.open().then(async function(){
    let wallet = await spvnode.plugins.walletdb.get('primary')

    console.log('spvnode opened')

    spvnode.connect()

    const stores = {
        walletStore: new WalletStore(wallet),
        joystreamStore: new JoystreamStore(session)
    }

    ReactDOM.render(
      <App stores={stores}/>,
      document.getElementById('root')
    )
})
