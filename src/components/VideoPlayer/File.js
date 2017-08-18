import LibtorrentStream from './LibtorrentStream'

class File {
    constructor (torrent, fileIndex) {

      this._torrent = torrent

      var torrentInfo = torrent.handle.torrentFile()

      // Require by media-render
      this.name = fileStorage.fileName(fileIndex)
    }

    /**
     * Called by render-media. Will return the ReadableStream object.
     * @param {object} opts : {start: bytes, end: bytes}
     */
    createReadStream (opts = {}) {
      var fileStream = new LibtorrentStream(torrent, opts)

      return fileStream
    }
}

export default File
