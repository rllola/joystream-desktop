import { observable, action } from 'mobx'
import { Session } from 'joystream-node'

class Joystream {
  @observable torrents = []

  constructor () {
    this.session = new Session()

    // Initiate array
    this.torrents = Array.from(this.session.torrents)
  }

  addTorrent (addTorrentParams) {
    this.session.addTorrent(addTorrentParams, (err, torrent) => {
      if (err) {
        console.log(err)
      } else {
        this.setTorrents()
      }
    })
  }

  @action setTorrents () {
    this.torrents = Array.from(this.session.torrents)
  }

}

const joystreamStore = new Joystream()

export default joystreamStore
