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

  async forEachTorrent (callback) {
    if (!callback) return
    if (typeof callback !== 'function') return

    try {
      debug('fetching torrents from db')
      var torrents = await this.torrents.getAll()
      debug('fetched ' + torrents.length + ' torrents from db')
    } catch (e) {
      this.emit('error', e.message)
      return
    }

    torrents.forEach(async (value) => {
      const infoHash = value.infoHash

      try {
        var params = util.storeValueToAddTorrentParams(value)
      } catch (e) {
        this.emit('error', 'valueToParams:' + e.message)
        return
      }

      // Load resume data if found
      try {
        debug('fetching resume data')
        let resume = await this.resume_data.getOne(infoHash)

        if (resume) {
          params.resumeData = Buffer.from(resume.data, 'base64')
        }
      } catch (e) {
        this.emit('error', 'resume data:' + e.message)
        return
      }
      callback(params)
    })
  }

  saveTorrent (torrent) {
    const infoHash = torrent.handle.infoHash()
    debug('saving torrent: ' + infoHash)
    let value = util.torrentHandleToStoreValue(torrent.handle)
    return this.torrents.save(infoHash, value).catch(err => this.emit('error', err))
  }

  saveTorrentResumeData (infoHash, buff) {
    debug('saving torrent resume data: ' + infoHash)
    let value = { infoHash, data: buff.toString('base64') }
    return this.resume_data.save(infoHash, value).catch(err => this.emit('error', err))
  }

  saveTorrentSettings (settings) {

  }

  removeTorrent (infoHash) {
    this.torrents.remove(infoHash).catch(err => this.emit('error', err))
    this.resume_data.remove(infoHash).catch(err => this.emit('error', err))
    this.torrent_settings.remove(infoHash).catch(err => this.emit('error', err))
  }

  async getInfoHashes () {

  }

  async getTorrentAddParameters (infoHash) {

  }

  async getTorrentResumeData (infoHash) {

  }

  async getTorrentSettings (infoHash) {

  }

  async getAllTorrentAddParameters () {

  }

  async getAllTorrentResumeData () {

  }

  async getAllTorrentSettings () {

  }

  async forEachInfoHash () {

  }
}

export default Store
