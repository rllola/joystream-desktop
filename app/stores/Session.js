import { observable, action } from 'mobx'

export default class Session {
  @observable torrents = []

  constructor (session) {
    this.session = session

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
