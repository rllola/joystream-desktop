import { TorrentInfo } from 'joystream-node'

// create an object from a torrent handle which can be serialized
// to a JSON string. The handle must be valid or it will return null
// The intent is to store torrent information and flags from the torrent status
// so the the torrent can be added to a session in the future with the same flags
function torrentHandleToStoreValue (handle) {
  if (!handle.isValid()) return null

  let value = {
    infoHash: handle.infoHash(),
    savePath: handle.savePath(),
    uploadLimit: handle.uploadLimit(),
    downloadLimit: handle.downloadLimit()
  }

  let ti = handle.torrentFile()

  if (ti) {
    value.name = ti.isValid() ? ti.name() : handle.infoHash()
    value.ti = ti.toBencodedEntry().toString('base64')
  }

  return value

  // some additional values to persists from handle.status()
  // http://www.libtorrent.org/reference-Core.html#torrent_status

  // application specific state (paused/started...)
  // terms and mode
  // mode: torrent.torrentPlugin.?
  // buyterTerms : torrent.terms
  // sellerTerms : null
}

// convert a stored torrent value to an addTorrentParams object
function storeValueToAddTorrentParams (value) {
  let params = {
    name: value.name,
    savePath: value.savePath,
    uploadLimit: value.uploadLimit,
    downloadLimit: value.downloadLimit
  }

  if (value.ti) {
    params.ti = new TorrentInfo(Buffer.from(value.ti, 'base64'))
  } else {
    params.infoHash = value.infoHash
  }

  return params
}

export default {torrentHandleToStoreValue, storeValueToAddTorrentParams}
