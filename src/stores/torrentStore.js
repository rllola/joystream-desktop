import { observable, action, computed } from 'mobx'
import { StateT } from 'joystream-node'

class Torrent {

  @observable libtorrentState
  @observable progress = 0
  @observable size = 0
  @observable name = ''

  constructor (torrent) {
    this.handle = torrent.handle

    this.infoHash = this.handle.infoHash()

    const torrentInfo = this.handle.torrentFile()

    this.setTorrentInfo(torrentInfo)

    const status = this.handle.status()

    this.setStatus(status)

    torrent.on('state_update_alert', this.onStateUpdated)

    torrent.on('metadata', this.onMetadataReceived)

    torrent.on('torrent_finished_alert', this.onFinished)
  }

  @action.bound
  onStateUpdated (state, progress) {
    this.setStatus({state, progress})
  }

  @action.bound
  onMetadataReceived (torrentInfo) {
    this.setTorrentInfo(torrentInfo)
  }

  @action.bound
  onFinished () {
    // Happens when a torrent switches from being a downloader to a seed.
    // It will only be generated once per torrent.
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
