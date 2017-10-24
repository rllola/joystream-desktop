const bcoin = require('bcoin')
const assert = require('assert')
import { EventEmitter } from 'events'

function overrideBcoinPoolHandleTxInv (pool) {
  // bcoin's "co-routine" library
  var co = bcoin.co

  // We are choosing to only override the instance method rather than the prototype
  pool.handleTXInv = co(function * handleTXInv (peer, hashes) {

    // Make sure we only do this for spvnodes
    assert(pool.options.spv)

    // Override bcoin pool normal behaviour in spv mode => Allow handling of incoming tx to mempool during syncing
    // This allows us to immedetialy start using unconfirmed balances and reflect it in the wallet
    // The consequence is that if the tx is mined into a block we will not learn about it until after
    // syncing completes.

    // As far as I can tell this does not lower the security of the spvnode, because
    // the validation performed on the incoming tx is no different than if an spvchain
    // is fully synced. (extensive validation is done by the mempool, spvnode doesn't have an instance of a mempool)

    assert(hashes.length > 0)

    // bcoin's implementation
    // if (this.syncing && !this.chain.synced) {
    //    return
    // }

    // Queues a `getdata` request to be sent. Checks tx existence before requesting.
    pool.ensureTX(peer, hashes)
  })
}

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
      network: this.network || 'testnet'
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

    node.chain.on('reset', () => {
      this.emit('reset')
    })

    node.chain.on('block', (block, entry) => {
      if (node.chain.total % 2000 === 0) {
        this.emit('syncProgress', node.chain.getProgress(), node.chain.tip.height)
      }
      // node.pool.x?  what do peers report as the current tip of their longest chain?
      // it is sent in the version message when we connect to them
    })

    // Ask for the mempool after syncing is done
    // node.pool.network.requestMempool = true
    overrideBcoinPoolHandleTxInv(node.pool)

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

    // Request the mempool as soon as we connect?
    // this.node.pool.sendMempool()

    this.node.startSync()
  }

  sendTx (tx) {
    if (!(tx instanceof bcoin.primitives.TX)) {
      tx = bcoin.primitives.TX.fromRaw(tx)
    }

    console.log('spvnode: sending raw TX:', tx.toRaw().toString('hex'))
    console.log('spvnode: TX ID:', tx.txid())

    return this.node.broadcast(tx)
  }
}

module.exports = SPVNode
