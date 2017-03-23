import { observable, computed } from 'mobx'
import SPVWallet from './SPVWallet/'

class Wallet {
  constructor() {
    this.wallet = new SPVWallet()
  }
}

const walletStore = new SPVWallet()

export default walletStore
