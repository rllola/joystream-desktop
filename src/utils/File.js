import LibtorrentStream from './LibtorrentStream'

class File {
    constructor (torrent, fileIndex) {

      this.torrent = torrent

      var torrentInfo = torrent.handle.torrentFile()
      var fileStorage = torrentInfo.files()

      // Require by media-render
      this.name = fileStorage.fileName(fileIndex)
      this.fileIndex = fileIndex
    }

    /**
     * Called by render-media. Will return the ReadableStream object.
     * @param {object} opts : {start: bytes, end: bytes}
     */
    createReadStream (opts = {}) {
      var fileStream = new LibtorrentStream(this.torrent, this.fileIndex, opts)

      return fileStream
    }
}

export default File
