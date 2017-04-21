import { TorrentInfo } from 'joystream-node'

// convert a stored torrent into an addTorrentParams object
function valueToAddTorrentParams (value) {
  let params = {
    name: value.name,
    savePath: value.savePath,
    uploadLimit: value.uploadLimit,
    downloadLimit: value.downloadLimit,
    resumeData: value.resumeData ? Buffer.from(value.resumeData, 'base64') : undefined
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

  if (!handle || !handle.isValid()) return null

  let value = {
    infoHash: handle.infoHash(),
    savePath: handle.savePath(),
    uploadLimit: handle.uploadLimit(),
    downloadLimit: handle.downloadLimit()
  }

  let ti = handle.torrentFile()

  if (ti) {
    value.name = ti.isValid() ? ti.name() : handle.infoHash()
    value.ti = ti.toBuffer().toString('base64')
  }

  // we might want to create a separate namespace in the db
  // for the resume data so it can be updated independently of the torrent info
  if (torrent.resumeData) {
    value.resumeData = torrent.resumeData.toString('base64')
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

class SessionConnector {
  constructor ({session, store}) {
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
      console.log(e.message)
      return
    }

    console.log('found', torrents.length, 'torrents in database')

    torrents.forEach((torrent) => {
      try {
        var params = valueToAddTorrentParams(torrent)
      } catch (e) {
        console.log(e)
        // remove this torrent from the database ?
        this.store.remove(torrent.infoHash)
        return
      }

      this.loading.set(torrent.infoHash, {
        buyerTerms: torrent.buyerTerms,
        sellerTerms: torrent.sellerTerms,
        paused: torrent.paused
      })

      try {
        this.session.addTorrent(params, (err, result) => {
          if (err) return console.log(err)
        })
      } catch (e) {
        this.loading.delete(torrent.infoHash)
        this.store.remove(torrent.infoHash)
      }
    })

    this.isLoading = false
  }

  _onTorrentAdded (torrent) {
    let infoHash = torrent.infoHash

    if (this.loading.has(infoHash)) {
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
