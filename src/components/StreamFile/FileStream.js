import { Readable } from 'stream'

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

     var pieceLength = file.pieceLength

     this._startPiece = (start + file.offset) / pieceLength | 0
     this._endPiece = (end + file.offset) / pieceLength | 0

     this._piece = this._startPiece

     this._offset = (start + file.offset) - (this._startPiece * pieceLength)

     this._prioritizedPieces = []

     this._missing = end - start + 1
     this._reading = false
     this._notifying = false
     this._criticalLength = Math.min((1024 * 1024 / pieceLength) | 0, 2) // Took from webtorrent

     this._onReadPiece = this._onReadPiece.bind(this)
     this._onPieceFinished = this._onPieceFinished.bind(this)

     this._torrent.on('readPiece', this._onReadPiece)
     this._torrent.on('pieceFinished', this._onPieceFinished)
   }

   _getCriticalPieces (index, criticalLength) {
     for ( var i = 0; i < criticalLength; i++ ) {
       var nextCriticalPiece = index + i
       if (!this._torrent.handle.havePiece(nextCriticalPiece)) {
         this._torrent.handle.piecePriority(nextCriticalPiece, HIGH_PRIORITY)
         this._prioritizedPieces.push(nextCriticalPiece)
       }
     }
   }

   _notify () {
    if (!this._reading || this._missing === 0) return
    if (!this._torrent.handle.havePiece(this._piece)) {
      this._getCriticalPieces(this._piece, this._criticalLength)
      return
    }

    if (this._notifying) return
    this._notifying = true

    this._torrent.handle.readPiece(this._piece)
   }

   _onPieceFinished (pieceIndex) {
     if (pieceIndex === this._piece) {
       this._torrent.handle.readPiece(pieceIndex)
     }
   }

   _onReadPiece (piece, err) {
     if (piece.index === this._piece) {

       this._notifying = false
       if (this.destroyed) return
       if (err) {
         return this._destroy(err)
       }

       if (this._offset) {
         piece.buffer = piece.buffer.slice(this._offset)
         this._offset = 0
       }

       if (this._missing < piece.buffer.length) {
         piece.buffer = piece.buffer.slice(0, this._missing)
       }
       this._missing -= piece.buffer.length

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
    this._torrent.removeListener('pieceFinished', this._onPieceFinished)

    for ( var i = 0; i < this._prioritizedPieces.length; i++ ) {
      var piece = index + i
      this._torrent.handle.piecePriority(piece, NORMAL_PRIORITY)
    }

    if (err) {
      this.emit('error', err)
    }
    this.emit('close')
    if (onclose) onclose()
  }

  destroy (onclose) {
    this._destroy(null, onclose)
  }

 }

export default FileStream
