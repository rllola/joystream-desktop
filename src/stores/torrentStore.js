import { observable, action, computed } from 'mobx'
import utils from '../utils'
import { SessionMode, TorrentState } from 'joystream-node'

class Torrent {

  @observable libtorrentState
  @observable progress = 0
  @observable size = 0
  @observable name = ''

  @observable mode

  constructor (torrent) {
    this.torrent = torrent

    this.setMode(SessionMode.not_set)

    this.infoHash = torrent.infoHash

    const torrentInfo = torrent.handle.torrentFile()

    this.setTorrentInfo(torrentInfo)

    const status = torrent.handle.status()

    this.setStatus(status)

    torrent.on('status_update', this.onStateUpdated.bind(this))

    torrent.on('metadata', this.onMetadataReceived.bind(this))

    torrent.on('finished', this.onFinished.bind(this))

    torrent.on('sessionToSellMode', (alert) => {
      this.setMode(SessionMode.selling)
    })

    torrent.on('sessionToBuyMode', (alert) => {
      this.setMode(SessionMode.buying)
    })

    torrent.on('sessionToObserveMode', (alert) => {
      this.setMode(SessionMode.observing)
    })
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

  pause () {
    this.torrent.handle.pause()
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

  @computed get stateName () {
    switch (this.libtorrentState) {
      case TorrentState.downloading:
        return 'Downloading'
      case TorrentState.downloading_metadata:
        return 'DownloadIncomplete Metadata'
      case TorrentState.finished:
        return 'Finished'
      case TorrentState.seeding:
        return 'Seeding'
      case TorrentState.allocating:
        return 'Allocating'
      case TorrentState.checking_resume_data:
        return 'Checking Resume Data'
      default:
        return ''
    }
  }

  @action.bound
  setProgress (progress) {
    this.progress = progress
  }

  @action.bound
  setMode (mode) {
    this.mode = mode
  }

  @computed get sizeMB () {
    return Number(this.size / 1048576).toFixed(2)
  }

  @computed get progressPercent () {
    return Number(this.progress * 100).toFixed(0)
  }
}

export default Torrent
