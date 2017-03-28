import { observable, action } from 'mobx'
import bcoin from 'bcoin'

class Wallet {
  @observable balance = 0.0

  constructor () {
    let options = {
      prefix: __dirname,
      network: 'testnet'
    }
    this.node = new bcoin.spvnode(options)
  }

  async open () {
    await this.node.open()
  }

  getAddress () {
    return this.node.wallet.getAddress()
  }
}

const walletStore = new Wallet()

export default walletStore
