import { observable, action, computed } from 'mobx'
import { StateT } from 'joystream-node'

class Torrent {

  @observable state
  @observable progress = 0
  @observable size = 0
  @observable name = ''

  constructor (torrent) {
    this.handle = torrent.handle

    this.infoHash = this.handle.infoHash()

    const torrentInfo = this.handle.torrentFile()

    if (torrentInfo) {
      this.name = torrentInfo.name()
      this.size = Number(torrentInfo.totalSize() / 1048576).toFixed(2)
    } else {
      this.name = this.handle.infoHash()
    }

    this.updateFromStatus()

    torrent.on('state_update_alert', action((state, progress) => {
      this.state = state
      this.progress = progress
    }))

    torrent.on('metadata_received_alert', this.updateFromStatus)

    torrent.on('torrent_finished_alert', this.updateFromStatus)
  }

  @action.bound
  updateFromStatus () {
    const status = this.handle.status()
    this.state = status.state
    this.progress = status.progress

    const torrentInfo = this.handle.torrentFile()
    if (torrentInfo) {
      this.name = torrentInfo.name()
      this.size = Number(torrentInfo.totalSize() / 1048576).toFixed(2)
    }
  }

  @computed get progressPercent () {
    return Number(this.progress * 100).toFixed(0)
  }

  @computed get statusText () {
    return StateT.properties[this.state].name
  }
}

export default Torrent
