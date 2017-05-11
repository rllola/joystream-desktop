import React, { Component } from 'react'
import {observer, inject} from 'mobx-react'
import { StateT } from 'joystream-node'

@inject('walletStore')
@observer
class SeedingTorrent extends Component {
  constructor (props) {
    super(props)

    this.startSelling = this.startSelling.bind(this)

    this.state = {
      inSellMode: false
    }
  }

  startSelling () {
    //  50, 1, 10, 15000, 5000
    let sellerTerms = {
      minPrice: 50,
      minLock: 1,
      maxNumberOfSellers: 10,
      minContractFeePerKb: 15000,
      settlementFee: 5000
    }

    this.props.torrent.toSellMode(sellerTerms, (err, result) => {
      if (!err) {
        this.setState({inSellMode: true})
        console.log('Looking for buyers')
      } else {
        console.log(err)
      }
    })
  }

  sellTo (buyer) {
    if (!buyer.contractSent) {
      let contractSk = this.props.walletStore.generatePrivateKey()
      let finalPkHash = this.props.walletStore.address.hash

      buyer.contractSent = true

      this.torrent.torrentObject.startSelling(buyer.peerPlugin.status.connection, contractSk, finalPkHash, (err, result) => {
        if (!err) {
          console.log('Selling to peer !')
        } else {
          buyer.contractSent = false
          console.error(err)
        }
      })
    }
  }

  render () {
    let torrent = this.props.torrent

    return (
      <tr>
        <td>{torrent.name}</td>
        <td>{torrent.sizeMB} Mb</td>
        <td>{torrent.progressPercent}%</td>
        <td>{torrent.libtorrentStateText}</td>
        <td>{ this.state.inSellMode ? <p>Looking for buyers ({this.props.torrent.buyers.length})</p> : <button className="btn btn-default" onClick={this.startSelling}>Start selling</button>}</td>
      </tr>
    )
  }
}

export default SeedingTorrent
