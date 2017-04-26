import { observable, action, computed } from 'mobx'
import Torrent from './torrentStore'
import { StateT, TorrentInfo } from 'joystream-node'

export default class Session {
  @observable torrents = []

  constructor ({session, savePath}) {
    this.session = session
    this.savePath = savePath

    // Initiate array
    action(() => {
      for (var [, torrent] in this.session.torrents) {
        this.torrents.push(new Torrent(torrent))
      }
    })()

    this.session.on('torrent_added', action((torrent) => {
      this.torrents.push(new Torrent(torrent))
    }))

    this.session.on('torrent_removed', action((infoHash) => {
      this.torrents.replace(this.torrents.filter(function (torrent) {
        return torrent.infoHash !== infoHash
      }))
    }))

    window.SessionStore = this
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
      if (err) console.log(err)
    })
  }

  @action
  addTorrent (addTorrentParams) {
    this.session.addTorrent(addTorrentParams, (err, torrent) => {
      if (err) console.log(err)
    })
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
