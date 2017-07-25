import { observable, action, computed, runInAction } from 'mobx'
import Torrent from '../core/Torrent/TorrentStore'
import { TorrentState, TorrentInfo, SessionMode } from 'joystream-node'

export default class Session {
  @observable torrents = []
  @observable loadingCount = 0

  constructor ({session, savePath}) {
    this.session = session
    this.savePath = savePath
  }

  @computed get torrentsDownloading () {
    return this.torrents.filter(function (torrent) {
      return (torrent.libtorrentState === TorrentState.downloading ||
        torrent.libtorrentState === TorrentState.downloading_metadata ||
        torrent.libtorrentState === TorrentState.allocating ||
        torrent.libtorrentState === TorrentState.checking_files ||
        torrent.libtorrentState === TorrentState.checking_resume_data)
    })
  }

  @computed get torrentsSeeding () {
    return this.torrents.filter(function (torrent) {
      return torrent.libtorrentState === TorrentState.seeding
    })
  }

  @computed get torrentsCompleted () {
    return this.torrents.filter(function (torrent) {
      return torrent.libtorrentState === TorrentState.finished || torrent.libtorrentState === TorrentState.seeding
    })
  }

  @computed get torrentsChecking () {
    return this.torrents.filter(function (torrent) {
      return torrent.libtorrentState === TorrentState.checking_files || torrent.libtorrentState === TorrentState.checking_resume_data
    })
  }

  @action
  removeTorrent (infoHash) {
    this.session.removeTorrent(infoHash, (err) => {
      if (err) return console.log(err)

      runInAction(() => {
        this.torrents.replace(this.torrents.filter(function (torrent) {
          return torrent.infoHash !== infoHash
        }))
      })
    })
  }

  @action
  addTorrent (addTorrentParams) {
    return this.loadTorrent(addTorrentParams).then((observableTorrent) => {
      return observableTorrent
    })
  }

  @action
  loadTorrent (addTorrentParams) {
    return new Promise((resolve, reject) => {
      // check we dont already have this torrent?

      this.loadingCount++
      this.session.addTorrent(addTorrentParams, (err, torrent) => {
        this.loadingCount--
        if (err) {
          console.log(err)
          return resolve(null)
        }
        let observableTorrent = this._insertTorrent(torrent)
        resolve(observableTorrent)
      })
    })
  }

  @action
  _insertTorrent (torrent) {
    const observableTorrent = new Torrent(torrent)

    this.torrents.push(observableTorrent)

    return observableTorrent
  }

  @action
  addTorrentFile (filePath) {
    this.addTorrent({
      ti: new TorrentInfo(filePath),
      savePath: this.savePath
    })
  }

  @action
  addTorrentUrl (url) {
    if (url.startsWith('magnet:')) {
      this.addTorrent({
        url: url,
        savePath: this.savePath
      })
    } else {
      this.addTorrent({
        infoHash: url,
        savePath: this.savePath
      })
    }
  }

  // Action to handle user attempting to add a torrent
  @action.bound
  handleAddTorrent (torrent) {
    if (torrent.file) {
      this.addTorrentFile(torrent.file.path)
    } else {
      this.addTorrentUrl(torrent.url)
    }
  }
}
