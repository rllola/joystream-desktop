import FileStream from './FileStream'
import eos from 'end-of-stream'
import { EventEmitter } from 'events'

class File extends EventEmitter {
    constructor (torrent, fileIndex) {
      super()

      this._torrent = torrent
      this._destroyed = false

      var torrentInfo = torrent.handle.torrentFile()
      var fileStorage = torrentInfo.files()

      this.pieceLength = torrentInfo.pieceLength()
      this.name = fileStorage.fileName(fileIndex)
      this.path = fileStorage.filePath(fileIndex)
      this.size = fileStorage.fileSize(fileIndex)
      this.offset = fileStorage.fileOffset(fileIndex)

      this.done = false

      var start = this.offset
      var end = start + this.size

      this._startPiece = start / this.pieceLength | 0
      this._endPiece = end / this.pieceLength | 0

      /*if (this.size === 0) {
        this.done = true
        this.emit('done')
      }*/
    }

    createReadStream (opts) {
      var self = this
      if (!opts) opts = {}
      console.log(opts)

      var fileStream = new FileStream(self, opts)
      eos(fileStream, function () {
        if (self._destroyed) return
        if (!self._torrent.destroyed) {
          //self._torrent.deselect(fileStream._startPiece, fileStream._endPiece, true)
        }
      })
      return fileStream
    }

    _destroy () {
      this._destroyed = true
      this._torrent = null
    }
}

export default File
