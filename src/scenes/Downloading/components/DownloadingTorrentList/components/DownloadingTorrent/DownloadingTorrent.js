import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { StateT } from 'joystream-node'
import utils from '../../../../../../utils/'

@inject('applicationStore')
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

    let infoHash = this.props.torrent.handle.infoHash()

    this.props.applicationStore.buyingTorrent(infoHash, buyerTerms)
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
