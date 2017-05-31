import React from 'react'
import { inject } from 'mobx-react'
import { StateT } from 'joystream-node'
import utils from '../../../../../../utils/'

//  50, 1, 10, 15000, 5000
// TEMPORARY
const sellerTerms = {
  minPrice: 50,
  minLock: 1,
  maxNumberOfSellers: 10,
  minContractFeePerKb: 15000,
  settlementFee: 5000
}

const SeedingTorrent = inject('applicationStore')((props) => {
  const torrent = props.torrent
  const applicationStore = props.applicationStore

  function startSelling () {
    let infoHash = torrent.handle.infoHash()

    applicationStore.sellingTorrent(infoHash, sellerTerms)
  }

  return (
    <tr>
      <td>{torrent.name}</td>
      <td>{torrent.sizeMB} Mb</td>
      <td>{torrent.progressPercent}%</td>
      <td>{StateT.properties[torrent.libtorrentState].name}</td>
      {/* If we have a buyer show button startSelling or startSelling directly after finding it */}
      <td>{torrent.mode === utils.TorrentMode.SELL_MODE ? <p>In Sell Mode</p> : <button className="btn btn-default" onClick={startSelling}>Start selling</button>}</td>
    </tr>
  )
})

export default SeedingTorrent
