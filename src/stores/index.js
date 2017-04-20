import bcoin from 'bcoin'
import path from 'path'
import os from 'os'
import { Session } from 'joystream-node'

import WalletStore from './walletStore'
import SessionStore from './sessionStore'

bcoin.set({ useWorkers: false })

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

const stores = spvnode
                .open()
                .then(async function () {
                  console.log('spvnode opened')
                  spvnode.connect()

                  const wallet = await spvnode.plugins.walletdb.get('primary')

                  return {
                    walletStore: new WalletStore(wallet),
                    sessionStore: new SessionStore({session, savePath})
                  }
                })

export default stores
