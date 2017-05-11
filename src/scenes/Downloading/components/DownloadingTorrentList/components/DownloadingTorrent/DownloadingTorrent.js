import React, { Component } from 'react'
import { observer } from 'mobx-react'

@observer
class DownloadingTorrent extends Component {
  constructor (props) {
    super(props)

    this.torrent = this.props.torrent

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

    this.torrent.pause()

    this.torrent.torrentObject.toBuyMode(buyerTerms, (err, result) => {
      if (!err) {
        /*this.torrent.on('readyToBuyTo', (seller) => {
          console.log(seller.contractSent)
          if (!seller.contractSent) {
            let contractSk = this.props.walletStore.generatePrivateKey()
            let finalPkHash = this.props.walletStore.address.hash
            let value = 50000

            seller.contractSent = true

            const callback = (err, result) => {
              console.log('Hey')
              if (!err) {
                console.log('Buying to peer !')
              } else {
                seller.contractSent = false
                console.error(err)
              }
            }

            this.torrent.torrentObject.startBuyingFromSeller(seller.peerPlugin.status.connection, contractSk, finalPkHash, value, this.props.walletStore.createAndSend, callback)
          }
        })*/
      } else {
        console.log(err)
      }
    })
  }


  render () {
    let torrent = this.props.torrent
    return (
      <tr>
        <td>{torrent.name}</td>
        <td>{torrent.sizeMB} Mb</td>
        <td>{torrent.progressPercent}%</td>
        <td>{torrent.libtorrentStateText}</td>
        <td><button className="btn btn-default" onClick={this.startBuying}>Start buying</button></td>
      </tr>
    )
  }
}

export default DownloadingTorrent
