import { observable, action, computed } from 'mobx'
import { StateT } from 'joystream-node'

class Torrent {

  @observable libtorrentState
  @observable progress = 0
  @observable size = 0
  @observable name = ''
  @observable buyers = []

  constructor(torrent) {
    this.handle = torrent.handle
    // Keep a reference to the underlying torrent instance to access the torrentPlugin
    this.torrent = torrent

    this.infoHash = torrent.handle.infoHash()

    const torrentInfo = torrent.handle.torrentFile()

    this.setTorrentInfo(torrentInfo)

    const status = torrent.handle.status()

    this.setStatus(status)

    torrent.on('state_update_alert', this.onStateUpdated.bind(this))

    torrent.on('metadata', this.onMetadataReceived.bind(this))

    torrent.on('torrent_finished_alert', this.onFinished.bind(this))

    torrent.on('readyToSellTo', this.receivedNewBuyer.bind(this))
  }

  onStateUpdated (statusUpdate) {
    this.setStatus(statusUpdate)
  }

  onMetadataReceived (torrentInfo) {
    this.setTorrentInfo(torrentInfo)
  }

  onFinished () {
    // Happens when a torrent switches from being a downloader to a seed.
    // It will only be generated once per torrent.
  }

  receivedNewBuyer (buyer) {
    this.addBuyer(buyer)
  }

  @action
  pause () {
    this.handle.pause()
  }

  @action
  toSellMode (sellerTerms, callback) {
    this.torrent.toSellMode(sellerTerms, callback)
  }

  @action.bound
  setTorrentInfo (info) {
    if (info) {
      this.setName(info.name())
      this.setSize(info.totalSize())
    } else {
      this.setName(this.infoHash)
    }
  }

  @action.bound
  setStatus ({state, progress}) {
    this.setLibtorrentState(state)
    this.setProgress(progress)
  }

  @action.bound
  setSize (size) {
    this.size = size
  }

  @action.bound
  setName (name) {
    this.name = name
  }

  @action.bound
  setLibtorrentState (state) {
    this.libtorrentState = state
  }

  @action.bound
  setProgress (progress) {
    this.progress = progress
  }

  @action.bound
  addBuyer (buyer) {
    this.buyers.push(buyer)
  }

  @computed get sizeMB () {
    return Number(this.size / 1048576).toFixed(2)
  }

  @computed get progressPercent () {
    return Number(this.progress * 100).toFixed(0)
  }

  @computed get libtorrentStateText () {
    return StateT.properties[this.libtorrentState].name
  }

}

export default Torrent
