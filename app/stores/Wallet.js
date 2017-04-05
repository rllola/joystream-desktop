import { observable, action } from 'mobx'
import bcoin from 'bcoin'

class Wallet {
  @observable balance = 0

  constructor () {
    let options = {
      'prefix': __dirname,
      'network': 'testnet',
      //'db': 'leveldb',
      //'wallet-db': 'leveldb',
      'plugins': ['walletdb'],
      'loader': function(name) {
          if(name === 'walletdb') return bcoin.walletplugin
      }
    }

    this.node = new bcoin.spvnode(options)

    // the wallet will be assigned after the node is started with call to open()
    this.wallet = null
  }

  async open () {
    await this.node.open()
    this.wallet = await this.node.plugins.walletdb.get('primary')
  }

  async getBalance () {
    let balance = await this.wallet.getBalance()
    this.balance = balance.confirmed
    return this.balance
  }

  connect () {
    return this.node.connect()
  }

  getAddress () {
    return this.wallet.getAddress()
  }
}

const walletStore = new Wallet()

export default walletStore
