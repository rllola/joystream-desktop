import EventEmitter from 'events'
import util from './util'
import Partition from './partition'

const debug = require('debug')('TorrentStore')

class Store extends EventEmitter {

  // Expect a levelup namespaced instance
  constructor (db, namespaces) {
    super()

    this.torrents = new Partition(db.namespace(namespaces['torrents']))
    this.resume_data = new Partition(db.namespace(namespaces['resume_data']))
    this.torrent_settings = new Partition(db.namespace(namespaces['torrent_settings']))
  }

  saveTorrent (torrent) {
    const infoHash = torrent.handle.infoHash()
    let value = util.torrentHandleToStoreValue(torrent.handle)
    return this.torrents.save(infoHash, value).catch(err => this.emit('error', err))
  }

  saveTorrentResumeData (infoHash, buff) {
    let value = { infoHash, data: buff.toString('base64') }
    return this.resume_data.save(infoHash, value).catch(err => this.emit('error', err))
  }

  saveTorrentSettings (infoHash, settings) {
    //encode settings ?
    return this.torrent_settings.save(infoHash, settings)
  }

  removeTorrent (infoHash) {
    return Promise.all([
      this.torrents.remove(infoHash),
      this.resume_data.remove(infoHash),
      this.torrent_settings.remove(infoHash)
    ]).catch(err => this.emit('error', err))
  }

  getInfoHashes () {
    return this.torrents.getAllKeys()
  }

  async getTorrentAddParameters (infoHash) {
    let value = await this.torrents.getOne(infoHash)

    if (value === null) return null

    try {
      var params = util.storeValueToAddTorrentParams(value)
    } catch (e) {
      this.emit('error', 'valueToParams:' + e.message)
      return null
    }

    // Load resume data if found
    let resumedata = await this.getTorrentResumeData(infoHash)

    if (resumedata) {
      params.resumeData = resumedata
    }

    return params
  }

  async getTorrentResumeData (infoHash) {
    let resume = await this.resume_data.getOne(infoHash)

    if (resume) {
      return Buffer.from(resume.data, 'base64')
    }

    return null
  }

  async getTorrentSettings (infoHash) {
    let settings = await this.torrent_settings.getOne(infoHash)
    // decode settings?
    return settings
  }
}

export default Store
