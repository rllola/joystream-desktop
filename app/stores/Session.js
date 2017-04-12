import { observable, action, computed } from 'mobx'
import Torrent from './Torrent.js'
import { StateT } from 'joystream-node'

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

  @computed get torrentsDownloading() {
    return this.torrents.filter(function(torrent){
      return ( torrent.state === StateT.DOWNLOADING ||
        torrent.state == StateT.DOWNLOADING_METADATA ||
        torrent.state == StateT.ALLOCATING)
    })
  }

  @computed get torrentsSeeding() {
    return this.torrents.filter(function(torrent){
      return torrent.state === StateT.SEEDING
    })
  }

  @computed get torrentsCompleted() {
    return this.torrents.filter(function(torrent){
      return torrent.state === StateT.FINISHED || torrent.state === StateT.SEEDING
    })
  }

  @computed get torrentsChecking() {
    return this.torrents.filter(function(torrent){
      return torrent.state === StateT.CHECKING_FILES || torrent.state === StateT.CHECKING_RESUME_DATA
    })
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
