import {Readable} from 'stream'

const HIGH_PRIORITY = 7
const NORMAL_PRIORITY = 4
const DEADLINE = 400 // 400 ms Random deadline
const ALERT_WHEN_AVAILABLE = 1


 class FileStream extends Readable {
   constructor (file, opts) {
     super(opts)

     this.destroyed = false
     this._torrent = file._torrent

     var start = (opts && opts.start) || 0
     var end = (opts && opts.end && opts.end < file.size)
       ? opts.end
       : file.size

     var pieceLength = file.pieceLength

     this._startPiece = (start + file.offset) / pieceLength | 0
     this._endPiece = (end + file.offset) / pieceLength | 0

     this._piece = this._startPiece

     this._offset = (start + file.offset) - (this._startPiece * pieceLength)

     this._prioritizedPieces = []
     this._pieces = []

     this._missing = end - start + 1
     this._reading = false
     this._notifying = false
     this._criticalLength = Math.min((1024 * 1024 / pieceLength) | 0, 2) // Took from webtorrent

     this._onReadPiece = this._onReadPiece.bind(this)
     this._torrent.on('readPiece', this._onReadPiece)
   }

   _getCriticalPieces (index, criticalLength) {
     for ( var i = 0; i < criticalLength; i++ ) {
       var nextCriticalPiece = index + i
       if (!this._torrent.handle.havePiece(nextCriticalPiece)) {
         this._torrent.handle.piecePriority(nextCriticalPiece, HIGH_PRIORITY)
       }
     }
   }

   _notify () {

    if (!this._reading || this._missing === 0) return
    if (!this._torrent.handle.havePiece(this._piece)) {
      console.log('Piece missing ! Need to download !')
      for ( var i = 0; i < this._criticalLength; i++ ) {
        var nextCriticalPiece = this._piece + i
        if (!this._torrent.handle.havePiece(nextCriticalPiece)) {
          this._torrent.handle.piecePriority(nextCriticalPiece, HIGH_PRIORITY)
          this._prioritizedPieces.push(nextCriticalPiece)
        }
      }
      //self._torrent.handle.prioritizePieces(this._prioritizedPieces)
      //console.log(this._torrent.handle.piecePriorities())
      //return self._torrent.handle.piecePriority(self._piece, HIGH_PRIORITY)
      //return self._torrent.critical(self._piece, self._piece + self._criticalLength)
    }

    if (this._notifying) return
    this._notifying = true

    self._torrent.handle.readPiece(this._piece)
   }

   _onReadPiece (piece, err) {
     console.log('Piece sent :' + piece.index + ', Piece needed :' + this._piece)
     if (piece.index === this._piece) {

       this._notifying = false
       if (this.destroyed) return
       if (err) return this._destroy(err)
       console.log('read %s (length %s)', this._piece, piece.buffer.length)

       if (this._offset) {
         piece.buffer = piece.buffer.slice(this._offset)
         this._offset = 0
       }

       if (this._missing < piece.buffer.length) {
         piece.buffer = piece.buffer.slice(0, this._missing)
       }
       this._missing -= piece.buffer.length

       console.log('pushing buffer of length %s', piece.buffer.length)
       this._reading = false
       this._piece += 1

       this.push(piece.buffer)

       if (this._missing === 0) {
         // We have transfered the all file
         this.push(null)
       }
     }
   }

  _read (size) {
    if (this._reading) return
    this._reading = true
    this._notify()
  }

  _destroy (err, onclose) {

    if (this.destroyed) return
    this.destroyed = true
    this._torrent.removeListener('readPiece', this._onReadPiece)

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
