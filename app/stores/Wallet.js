import { observable, action, computed, runInAction } from 'mobx'
import bcoin from 'bcoin'

export default class WalletStore {
  @observable balance = 0
  @observable address = null

  constructor (wallet) {
    this.wallet = wallet

    this.wallet.on('balance', action('on-balance-handler', (balance) => {
        this.balance = balance.unconfirmed
    }))

    this.wallet.on('address', this.updateAddress)

    // setup initial state
    this.updateBalance()
    this.updateAddress()
  }

  @action
  updateBalance = async() => {
    const balance = await this.wallet.getBalance()
    runInAction("update wallet balance", () => {
        this.balance = balance.unconfirmed
    })
  }

  @action.bound
  updateAddress() {
    this.address = this.wallet.getAddress()
  }

}
