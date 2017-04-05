import { observable, action } from 'mobx'
import bcoin from 'bcoin'

const logError = require('debug')('wallet:error')

class Wallet {
  @observable balance = 0

  constructor () {
    let options = {
      prefix: __dirname,
      network: 'testnet'
    }
    this.node = new bcoin.spvnode(options)

    this.node.on('error', function(err){
        logError(err.message)
    })
  }

  async open () {
    await this.node.open()
  }

  getBalance () {
    this.node.wallet.getBalance().then((balance) => {
      this.balance = balance.confirmed
    })
  }

  connect () {
    return this.node.connect()
  }

  getAddress () {
    return this.node.wallet.getAddress()
  }
}

const walletStore = new Wallet()

export default walletStore
