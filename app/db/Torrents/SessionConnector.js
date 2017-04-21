import { TorrentInfo } from 'joystream-node'
import EventEmitter from 'events'
const debug = require('debug')('SessionConnector')

// convert a stored torrent into an addTorrentParams object
function valueToAddTorrentParams (value) {
  let params = {
    name: value.name,
    savePath: value.savePath,
    uploadLimit: value.uploadLimit,
    downloadLimit: value.downloadLimit
  }

  if (value.ti) {
    params.ti = new TorrentInfo(Buffer.from(value.ti, 'base64'))
  } else {
    params.infoHash = value.infoHash
  }

  return params
}

// serialize the torrent to store in the database
function torrentToStorageValue (torrent) {
  let handle = torrent.handle

  if (!handle.isValid()) return null

  let value = {
    infoHash: handle.infoHash(),
    savePath: handle.savePath(),
    uploadLimit: handle.uploadLimit(),
    downloadLimit: handle.downloadLimit()
  }

  let ti = handle.torrentFile()

  if (ti) {
    value.name = ti.isValid() ? ti.name() : handle.infoHash()
    value.ti = ti.toBencodedEntry().toString('base64')
  }

  return value

  // what if a torrent was added by a magnetlink, will ti be valid before metadata is downloaded?
  // do we need to save the url?

  // application specific state (paused/started...)
  // terms and mode
  // mode: torrent.torrentPlugin.?
  // buyterTerms : torrent.terms
  // sellerTerms : null
}

class SessionConnector extends EventEmitter {
  constructor ({session, store}) {
    super()
    this.session = session
    this.store = store
    this.loading = new Map()
    this.isLoading = false

    // setup listeners on session
    session.on('torrent_added', this._onTorrentAdded.bind(this))
    session.on('torrent_removed', this._onTorrentRemoved.bind(this))

    // also handle
    // metadata received
    // resume data generated
  }

  async load () {
    if (this.isLoading) return
    this.isLoading = true

    try {
      var torrents = await this.store.getAll()
    } catch (e) {
      this.isLoading = false
      this.emit('error', e.message)
      return
    }

    debug('found ' + torrents.length + ' torrents in database')

    torrents.forEach((value) => {
      const infoHash = value.infoHash

      try {
        var params = valueToAddTorrentParams(value)
      } catch (e) {
        // remove this torrent from the database ?
        this.store.remove(infoHash)
        this.emit('error', e.message)
        return
      }

      this.loading.set(infoHash, {
        buyerTerms: value.buyerTerms,
        sellerTerms: value.sellerTerms
      })

      try {
        debug('adding torrent to session: ' + infoHash)
        this.session.addTorrent(params, (err, result) => {
          if (err) {
            this.loading.delete(infoHash)
            this.emit('error', err)
          }
        })
      } catch (e) {
        this.loading.delete(infoHash)
        this.emit('error', e.message)
      }
    })

    this.isLoading = false
  }

  _onTorrentAdded (torrent) {
    let infoHash = torrent.handle.infoHash()

    if (this.loading.has(infoHash)) {
      debug('successfully added torrent from database: ' + infoHash)
      // check if this is a torrent we loaded from the database
      let loadedTorrent = this.loading.get(infoHash)
      // resume torrent, schedule to go to buy or sell mode...
      this.loading.delete(infoHash)
    } else {
      this.store.save(torrentToStorageValue(torrent))
    }
  }

  _onTorrentRemoved (infoHash) {
    this.store.remove(infoHash)
  }
}

export default SessionConnector
