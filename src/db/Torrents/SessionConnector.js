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

  // application specific state (paused/started...)
  // terms and mode
  // mode: torrent.torrentPlugin.?
  // buyterTerms : torrent.terms
  // sellerTerms : null
}

class SessionConnector extends EventEmitter {
  constructor ({session, torrents, resumeData}) {
    super()
    this.session = session
    this.torrents = torrents
    this.resumeData = resumeData
    this.loading = new Map()
    this.isLoading = false

    // setup listeners on session
    session.on('torrent_added', this._onTorrentAdded.bind(this))
    session.on('torrent_removed', this._onTorrentRemoved.bind(this))
  }

  async load () {
    if (this.isLoading) return
    this.isLoading = true

    try {
      var torrents = await this.torrents.getAll()
    } catch (e) {
      this.isLoading = false
      this.emit('error', e.message)
      return
    }

    debug('found ' + torrents.length + ' torrents in database')

    torrents.forEach(async (value) => {
      const infoHash = value.infoHash

      try {
        var params = valueToAddTorrentParams(value)
      } catch (e) {
        // remove this torrent from the database ?
        this.torrents.remove(infoHash)
        this.emit('error', e.message)
        return
      }

      this.loading.set(infoHash, {
        buyerTerms: value.buyerTerms,
        sellerTerms: value.sellerTerms
      })

      // Load resume data if found
      let resume = await this.resumeData.getOne(infoHash)
      if (resume) {
        debug('found resume data for ' + infoHash)
        params.resumeData = Buffer.from(resume.data, 'base64')
      }

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

    torrent.on('metadata', this._onMetaDataReceived.bind(this))
    torrent.on('resumedata', this._onResumeData.bind(this, infoHash))

    if (this.loading.has(infoHash)) {
      debug('successfully added torrent from database: ' + infoHash)
      // check if this is a torrent we loaded from the database
      let loadedTorrent = this.loading.get(infoHash)
      // resume torrent, schedule to go to buy or sell mode...
      this.loading.delete(infoHash)
      return
    }

    this._saveTorrent(torrent)
  }

  _onTorrentRemoved (infoHash) {
    this.torrents.remove(infoHash).catch(err => this.emit('error', err))
  }

  _onMetaDataReceived (torrentInfo) {
    const infoHash = torrentInfo.infoHash()
    let torrent = this.session.torrents.get(infoHash)
    this._saveTorrent(torrent)
  }

  _saveTorrent (torrent) {
    this.torrents.save(torrentToStorageValue(torrent)).catch(err => this.emit('error', err))
  }

  _onResumeData (infoHash, buffer) {
    let value = { infoHash, data: buffer.toString('base64') }
    this.resumeData.save(value).catch(err => this.emit('error', err))
  }
}

export default SessionConnector
