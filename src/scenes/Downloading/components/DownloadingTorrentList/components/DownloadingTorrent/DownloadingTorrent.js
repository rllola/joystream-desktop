import React from 'react'
import { inject, observer } from 'mobx-react'
import { SessionMode } from 'joystream-node'

//  100, 5, 1, 20000
const buyerTerms = {
  maxPrice: 100,
  maxLock: 5,
  minNumberOfSellers: 1,
  maxContractFeePerKb: 20000
}

const DownloadingTorrent = inject('applicationStore')(observer((props) => {
  const torrent = props.torrent
  const applicationStore = props.applicationStore

  function startBuying () {
    applicationStore.buyingTorrent(torrent.infoHash, buyerTerms)
  }

  return (
    <tr>
      <td>{torrent.name}</td>
      <td>{torrent.sizeMB} Mb</td>
      <td>{torrent.progressPercent}%</td>
      <td>{torrent.stateName}</td>
      {/* If we have a buyer show button startSelling or startSelling directly after finding it */}
      <td>{torrent.mode === SessionMode.buying ? <p>In Buy Mode</p> : <button className="btn btn-default" onClick={startBuying}>Start buying</button>}</td>
    </tr>
  )
}))

export default DownloadingTorrent
