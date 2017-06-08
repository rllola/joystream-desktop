import React from 'react'
import { inject, observer } from 'mobx-react'
import { SessionMode } from 'joystream-node'

//  50, 1, 10, 15000, 5000
// TEMPORARY
const sellerTerms = {
  minPrice: 50,
  minLock: 1,
  maxNumberOfSellers: 10,
  minContractFeePerKb: 15000,
  settlementFee: 5000
}

const SeedingTorrent = inject('applicationStore')(observer((props) => {
  const torrent = props.torrent
  const applicationStore = props.applicationStore

  function startSelling () {
    applicationStore.sellingTorrent(torrent.infoHash, sellerTerms)
  }

  return (
    <tr>
      <td>{torrent.name}</td>
      <td>{torrent.sizeMB} Mb</td>
      <td>{torrent.progressPercent}%</td>
      <td>{torrent.stateName}</td>
      {/* If we have a buyer show button startSelling or startSelling directly after finding it */}
      <td>{torrent.mode === SessionMode.selling ? <p>In Sell Mode</p> : <button className="btn btn-default" onClick={startSelling}>Start selling</button>}</td>
    </tr>
  )
}))

export default SeedingTorrent
