import { observable, action, computed } from 'mobx'
import bcoin from 'bcoin'

export default class WalletStore {
  @observable balance = 0
  @observable address = null

  constructor (wallet) {
    this.wallet = wallet

    // update the balance and address when they change, make arrow functions -> actions
    this.wallet.on('balance', (balance) => { this.balance = balance.unconfirmed })
    this.wallet.on('address', () => { this.address = this.wallet.getAddress() })

    // setup initial state
    this.updateBalanceAndAddress()
  }

  // make this an action
  async updateBalanceAndAddress () {
    this.address = this.wallet.getAddress()
    let balance = await this.wallet.getBalance()
    this.balance = balance.unconfirmed
  }

}
