import { observable, action, computed, runInAction } from 'mobx'
import Torrent from './torrentStore'
import { StateT, TorrentInfo } from 'joystream-node'

export default class Session {
  @observable torrents = []
  @observable loadingCount = 0

  constructor ({session, savePath, db}) {
    this.session = session
    this.savePath = savePath
    this.db = db
  }

  @computed get torrentsDownloading () {
    return this.torrents.filter(function (torrent) {
      return (torrent.libtorrentState === StateT.DOWNLOADING ||
        torrent.libtorrentState === StateT.DOWNLOADING_METADATA ||
        torrent.libtorrentState === StateT.ALLOCATING ||
        torrent.libtorrentState === StateT.CHECKING_FILES ||
        torrent.libtorrentState === StateT.CHECKING_RESUME_DATA)
    })
  }

  @computed get torrentsSeeding () {
    return this.torrents.filter(function (torrent) {
      return torrent.libtorrentState === StateT.SEEDING
    })
  }

  @computed get torrentsCompleted () {
    return this.torrents.filter(function (torrent) {
      return torrent.libtorrentState === StateT.FINISHED || torrent.libtorrentState === StateT.SEEDING
    })
  }

  @computed get torrentsChecking () {
    return this.torrents.filter(function (torrent) {
      return torrent.libtorrentState === StateT.CHECKING_FILES || torrent.libtorrentState === StateT.CHECKING_RESUME_DATA
    })
  }

  @action
  removeTorrent (infoHash) {
    this.session.removeTorrent(infoHash, (err) => {
      if (err) return console.log(err)
      this.db.removeTorrent(infoHash)
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
      if (observableTorrent) {
        this.db.saveTorrent(observableTorrent.torrent)
      }
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
    const infoHash = torrent.handle.infoHash()
    const observableTorrent = new Torrent(torrent)

    this.torrents.push(observableTorrent)

    torrent.on('metadata', (torrentInfo) => {
      this.db.saveTorrent(torrent)
    })

    torrent.on('resumedata', (buff) => {
      this.db.saveTorrentResumeData(infoHash, buff)
    })

    // Save resume data when paused or finished
    torrent.on('paused', () => {
      torrent.handle.saveResume_data()
    })

    torrent.on('finished', () => {
      torrent.handle.saveResume_data()
    })

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
