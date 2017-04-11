import { observable, action, computed, runInAction } from 'mobx'
import { StateT } from 'joystream-node'

class Torrent {

  @observable state
  @observable progress = 0

  constructor(torrent) {
    this.handle = torrent.handle

    this.infoHash = this.handle.infoHash()

    const torrentInfo = this.handle.torrentFile()

    this.name = torrentInfo.name()

    this.size = Number(torrentInfo.totalSize() / 1000000).toFixed(2)

    this.updateFromStatus()

    torrent.on('state_update_alert', action((state, progress) => {
      this.state = state
      this.progress = progress
    }))

    torrent.on('metadata_received_alert', this.updateFromStatus)

    torrent.on('torrent_finished_alert', this.updateFromStatus)
  }

  @action.bound
  updateFromStatus() {
    const status = this.handle.status()
    this.state = status.state
    this.progress = status.progress
  }

  @computed get progressPercent () {
    return Number(this.progress*100).toFixed(0)
  }

  @computed get statusText () {
    return StateT.properties[this.state].name
  }
}

export default Torrent
