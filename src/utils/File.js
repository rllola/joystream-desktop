import LibtorrentStream from './LibtorrentStream'
import fs from 'fs'
import path from 'path'

class File {
    constructor (torrent, fileIndex, completed = false) {

      this.torrent = torrent

      var torrentInfo = torrent.handle.torrentFile()
      var fileStorage = torrentInfo.files()

      // Require by media-render
      this.name = fileStorage.fileName(fileIndex)
      this.path = path.format({dir:this.torrent.handle.savePath(), base: fileStorage.filePath(fileIndex)})
      this.fileIndex = fileIndex
      this.completed = completed
    }

    /**
     * Called by render-media. Will return the ReadableStream object.
     * @param {object} opts : {start: bytes, end: bytes}
     */
    createReadStream (opts = {}) {

      if (this.completed) {
        return fs.createReadStream(this.path, opts)
      }

      return new LibtorrentStream(this.torrent, this.fileIndex, opts)
    }
}

export default File
