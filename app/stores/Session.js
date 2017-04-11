import { observable, action } from 'mobx'
import Torrent from './Torrent.js'

export default class Session {
  @observable torrents = []

  constructor (session) {
    this.session = session

    // Initiate array
    action(() => {
      for(var [infoHash, torrent] in this.session.torrents) {
        this.torrents.push(new Torrent(torrent))
      }
    })()

    this.session.on('torrent_added', action((torrent) => {
      this.torrents.push(new Torrent(torrent))
    }))

    this.session.on('torrent_removed', action((infoHash) => {
      this.torrents.replace(this.torrents.filter(function(torrent){
        return torrent.infoHash != infoHash
      }))
    }))
  }

  @action
  removeTorrent(infoHash) {
    this.session.removeTorrent(infoHash, (err, result)=>{
      if(err) console.log(err)
    })
  }

  @action
  addTorrent (addTorrentParams) {
    this.session.addTorrent(addTorrentParams, (err, torrent) => {
      if (err) console.log(err)
    })
  }
}
