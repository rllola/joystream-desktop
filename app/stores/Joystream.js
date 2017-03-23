import { observable, computed } from 'mobx'
import { Session } from 'joystream-node'

class Joystream {
  @observable torrents = []

  constructor() {
    this.session = new Session()

    // Initiate array
    this.torrents = Array.from(this.session.torrents)
  }

  addTorrent (addTorrentParams) {
    session.addTorrent(addTorrentParams, (err, torrent) => {
      if (err) {
        console.log(err)
      } else {
        torrents.push(torrent)
      }
    })
  }
}

const joystreamStore = new Joystream()

export default joystreamStore
