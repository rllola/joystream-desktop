import { observable, action } from 'mobx'
import { Session } from 'joystream-node'

class Joystream {
  @observable torrents = []

  constructor () {
    this.session = new Session({
      port: process.env.PORT
    })

    // Initiate array
    this.torrents = Array.from(this.session.torrents)
  }

  @action
  addTorrent (addTorrentParams) {
    this.session.addTorrent(addTorrentParams, (err, torrent) => {
      if (err) {
        console.log(err)
      } else {
        this.torrents = Array.from(this.session.torrents)
      }
    })
  }
}

const joystreamStore = new Joystream()

export default joystreamStore
