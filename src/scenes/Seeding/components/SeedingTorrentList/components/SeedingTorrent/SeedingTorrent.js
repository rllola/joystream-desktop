import React, { Component } from 'react'
import { inject } from 'mobx-react'
import { StateT } from 'joystream-node'
import utils from '../../../../../../utils/'

@inject('applicationStore')
class SeedingTorrent extends Component {

  constructor (props) {
    super(props)

    this.startSelling = this.startSelling.bind(this)
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

    this.props.applicationStore.sellingTorrent(this.props.torrent.handle.infoHash(), sellerTerms)
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
        <td>{torrent.mode == utils.TorrentMode.SELL_MODE ? <p>In Sell Mode</p> : <button className="btn btn-default" onClick={this.startSelling}>Start selling</button>}</td>
      </tr>
    )
  }
}

export default SeedingTorrent
