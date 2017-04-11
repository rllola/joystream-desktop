import { observable, action } from 'mobx'
import Torrent from './Torrent.js'

export default class Session {
  @observable torrents = []

  constructor (session) {
    this.session = session

    // Initiate array
    this.initTorrents()

    this.session.on('torrent_added', action((torrent) => {
      this.torrents.push(new Torrent(torrent))
    }))

    this.session.on('torrent_removed', this.initTorrents)
  }

  @action.bound
  initTorrents () {
    for(var [infoHash, torrent] in this.session.torrents) {
      this.torrents.push(new Torrent(torrent))
    }
  }

  @action
  addTorrent (addTorrentParams) {
    this.session.addTorrent(addTorrentParams, (err, torrent) => {
      if (err) console.log(err)
    })
  }
}
