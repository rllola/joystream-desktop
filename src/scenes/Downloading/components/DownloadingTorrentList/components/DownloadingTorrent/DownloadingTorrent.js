import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { StateT } from 'joystream-node'
import utils from '../../../../../../utils/'

@inject('walletStore')
class DownloadingTorrent extends Component {
  constructor (props) {
    super(props)

    this.startBuying = this.startBuying.bind(this)
  }

  startBuying () {
    //  100, 5, 1, 20000
    let buyerTerms = {
      maxPrice: 100,
      maxLock: 5,
      minNumberOfSellers: 1,
      maxContractFeePerKb: 20000
    }

    this.props.torrent.toBuyMode(buyerTerms, (err, result) => {
      if (!err) {
        console.log('Ok')
      } else {
        console.log(err)
      }
    })
  }

  BuyFrom (seller) {
    if (!seller.contractSent) {
      let contractSk = this.props.walletStore.generatePrivateKey()
      let finalPkHash = this.props.walletStore.address.hash
      let value = 50000

      seller.contractSent = true

      const callback = (err, result) => {
        if (!err) {
          console.log('Buying to peer !')
        } else {
          seller.contractSent = false
          console.error(err)
        }
      }

      this.props.torrent.startBuying(seller.peerPlugin.status.connection, contractSk, finalPkHash, value, this.props.walletStore.createAndSend, callback)
    }
  }

  render () {
    let torrent = this.props.torrent
    return (
      <tr>
        <td>{torrent.name}</td>
        <td>{torrent.sizeMB} Mb</td>
        <td>{torrent.progressPercent}%</td>
        <td>{StateT.properties[torrent.libtorrentState].name}</td>
        {/* If we have a buyer show button startSelling or startSelling directly after finding it */}
        <td>{torrent.mode == utils.TorrentMode.BUY_MODE ? <p>In Buy Mode</p> : <button className="btn btn-default" onClick={this.startBuying}>Start buying</button>}</td>
      </tr>
    )
  }
}

export default DownloadingTorrent
