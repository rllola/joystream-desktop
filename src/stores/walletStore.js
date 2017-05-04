import { observable, action } from 'mobx'
import bcoin from 'bcoin'

export default class WalletStore {
  @observable balance = 0
  @observable address = null

  constructor (wallet) {
    this.wallet = wallet

    this.wallet.on('balance', this.onBalance.bind(this))

    this.wallet.on('address', this.onAddress.bind(this))

    // setup initial state
    this.updateBalance()
    this.updateAddress()
  }

  onBalance (balance) {
    this.setBalance(balance)
  }

  onAddress () {
    this.updateAddress()
  }

  @action
  updateBalance = async() => {
    const balance = await this.wallet.getBalance()
    this.setBalance(balance)
  }

  @action
  setBalance (balance) {
    this.balance = balance.unconfirmed
  }

  @action
  updateAddress () {
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
    })
  }

}
