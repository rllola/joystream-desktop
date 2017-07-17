import Readable from 'readable-stream'

const HIGH_PRIORITY = 7
const NORMAL_PRIORITY = 4

 class FileStream extends Readable {
   constructor (file, opts) {
     super(opts)

     this.destroyed = false
     this._torrent = file._torrent

     var start = (opts && opts.start) || 0
     var end = (opts && opts.end && opts.end < file.size)
       ? opts.end
       : file.size

    console.log('start : ', start)
    console.log('end : ', end)

     var pieceLength = file.pieceLength

     this._startPiece = (start + file.offset) / pieceLength | 0
     this._endPiece = (end + file.offset) / pieceLength | 0

     console.log('start piece :', this._startPiece)
     console.log('end piece :', this._endPiece)

     this._piece = this._startPiece
     this._offset = (start + file.offset) - (this._startPiece * pieceLength)

     this._missing = end - start + 1
     this._reading = false
     this._notifying = false
     this._criticalLength = Math.min((1024 * 1024 / pieceLength) | 0, 2)
   }

   _notify () {
     var self = this

    if (!self._reading || self._missing === 0) return
    if (!self._torrent.handle.havePiece(self._piece)) {
      return self._torrent.handle.piecePriority(self._piece, HIGH_PRIORITY)
      //return self._torrent.critical(self._piece, self._piece + self._criticalLength)
    }

    if (self._notifying) return
    self._notifying = true

    var p = self._piece

    self._torrent.handle.readPiece(p)
    self._torrent.on('readPiece', (piece, err) => {
      if (piece.index === p) {

        self._notifying = false
        if (self.destroyed) return
        if (err) return self._destroy(err)
        console.log('read %s (length %s)', p, piece.buffer.length)

        if (self._offset) {
          piece.buffer = piece.buffer.slice(self._offset)
          self._offset = 0
        }

        if (self._missing < piece.buffer.length) {
          piece.buffer = piece.buffer.slice(0, self._missing)
        }
        self._missing -= piece.buffer.length

        console.log('pushing buffer of length %s', piece.buffer.length)
        self._reading = false
        self.push(piece.buffer)

        if (self._missing === 0) {
          self.push(null)
        }
      }

    })

    self._piece += 1
   }

  _read (size) {
    if (this._reading) return
    this._reading = true
    this._notify()
  }

  _destroy (err, onclose) {

    if (this.destroyed) return
    this.destroyed = true

    if (!this._torrent.destroyed) {
      //this._torrent.deselect(this._startPiece, this._endPiece, true)
    }

    if (err) this.emit('error', err)
    this.emit('close')
    if (onclose) onclose()
  }

  destroy (onclose) {
    this._destroy(null, onclose)
  }

 }

export default FileStream
