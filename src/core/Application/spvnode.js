const bcoin = require('bcoin')
const assert = require('assert')
import { EventEmitter } from 'events'

class SPVNode extends EventEmitter {

  constructor (network, logLevel, walletPrefix) {
    super()

    this.walletPrefix = walletPrefix
    this.network = network
    this.logLevel = logLevel

    this.node = this._create()
  }

  options () {
    const o = {
      prefix: this.walletPrefix,
      db: 'leveldb',
      network: this.network || 'testnet',
      requestMempool: true
    }

    // Add a logger if log level is specified
    if (this.logLevel) {
      o.logger = new bcoin.logger({
        level: this.logLevel
      })
    }

    return o
  }

  _create () {
    var node = new bcoin.spvnode(this.options())

    // Attach the walletdb plugin
    node.use(bcoin.walletplugin)

    // Disable http/rpc - to avoid any port conflict issues. Also more secure option
    node.http = null

    node.chain.on('full', () => {
      this.emit('syncProgress', 1)
      this.emit('synced', node.chain.height)
    })

    node.chain.on('block', (block, entry) => {
      if (node.chain.total % 2000 === 0) {
        this.emit('syncProgress', node.chain.getProgress(), node.chain.tip.height)
      }
      // node.pool.x?  what do peers report as the current tip of their longest chain?
      // it is sent in the version message when we connect to them
    })

    return node
  }

  async open (callback) {
    /* code marked "temp" is workaround until http listen fix is merged into bcoin release */
    // temp
    const error = (err) => {
      if (err.code !== 'EADDRINUSE') return
      if (error.handled) return
      error.handled = true
      this.node = null // to skip call to spvnode.close() in closeSpvNode() - because asyncobject might still be locked
      callback(err)
    }

    // temp
    this.node.once('error', error)

    try {
      await this.node.open()
    } catch (err) {
      if (error.handled) return // temp
      return callback(err)
    }

    // before the fix .. if there is an error listening on the port code will never even reach here

    assert(!error.handled) // temp - but should always hold

    callback()
  }

  close () {
    return this.node.close()
  }

  disconnect () {
    this.node.stopSync()
    return this.node.disconnect()
  }

  getWallet (id = 'primary') {
    return this.node.plugins.walletdb.get(id)
  }

  async connect () {
    await this.node.connect()
    this.node.startSync()
  }

  sendTx (tx) {
    if (!(tx instanceof bcoin.primitives.TX)) {
      tx = bcoin.primitives.TX.fromRaw(tx)
    }

    return this.node.broadcast(tx)
  }
}

module.exports = SPVNode
