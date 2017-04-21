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

    this.createAndSend = this.createAndSend.bind(this)

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

  generatePrivateKey () {
    return bcoin.ec.generatePrivateKey()
  }

  // Create, fund and sign a transaction from array of outputs
  // (commitments of a joystream contract)
  createAndSend (rawOutputs, feeRate) {
    // return the transaction (promise)
    let outputs = []

    // Get each output and sign it
    for (let i in rawOutputs) {
      outputs.push(bcoin.output.fromRaw(rawOutputs[i]))
    }

    // Wait for all the outputs to be signed
    return this.wallet.send({
      sort: false,
      outputs: outputs,
      rate: feeRate
    }).then((transaction) => {
      return transaction.toRaw()
    }).catch((error) => {
      throw error
    })
  }

}
