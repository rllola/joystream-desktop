import { observable, action, computed } from 'mobx'
import bcoin from 'bcoin'

export default class WalletStore {
  @observable balance = 0
  @observable address = null

  constructor (spvnode) {
    this.node = spvnode
  }

  async open () {
    await this.node.open()
    this.wallet = await this.node.plugins.walletdb.get('primary')

    // setup initial state
    this.address = this.wallet.getAddress()
    this.updateBalance()

    // update the balance and address when they change
    this.wallet.on('balance', (balance) => { this.balance = balance.unconfirmed })
    this.wallet.on('address', () => { this.address = this.wallet.getAddress() })
  }

  async updateBalance () {
    let balance = await this.wallet.getBalance()
    this.balance = balance.unconfirmed
  }

  connect () {
    return this.node.connect()
  }

}
