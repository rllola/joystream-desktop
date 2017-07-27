import { Readable } from 'stream'

// Libtorrent highest piece priority value.
const HIGH_PRIORITY = 7
// Libtorrent default piece priority value.
const NORMAL_PRIORITY = 4

/**
 * LibtorrentStream is a Readable object that fetch and/or wait for libtorrent
 * piece. The are then `pushed` into the stream to be read by the player.
 *
 *  # # # # #  Wait for piece.   # # # # # # # # #
 *  # _read # -----------------> # _onReadPiece  #
 *  # # # # #                    # # # # # # # # #
 *     ^         * * * * * * *          |
 *     |  call   * New `data`*          |  Push piece into
 *     --------- * event     * <---------  stream.
 *               * * * * * * *
 *               In render-media
 *               module.
 *
 * @param {object} torrent
 */
 class LibtorrentStream extends Readable {
   constructor (torrent, opts) {
     super(opts)

     this.destroyed = false
     this._torrent = torrent

     var torrentInfo = torrent.handle.torrentFile()
     var fileStorage = torrentInfo.files()

     this.pieceLength = torrentInfo.pieceLength()
     this.fileSize = fileStorage.fileSize(fileIndex)
     this.fileOffset = fileStorage.fileOffset(fileIndex)

     var start = (opts && opts.start) || 0
     var end = (opts && opts.end && opts.end < this.fileSize)
       ? opts.end
       : this.fileSize

     var pieceLength = this.pieceLength

     this._startPiece = (start + this.fileOffset) / pieceLength | 0
     this._endPiece = (end + this.fileOffset) / pieceLength | 0

     // The current piece needed
     this._piece = this._startPiece

     // The offset in the current piece requested. Might bee needed when seeking
     // in the video and asking for bytes that doesn't specificaly correspond with a
     // an exact piece starting range.
     this._offset = (start + this.fileOffset) - (this._startPiece * pieceLength)

     // Piece that has has high priority
     this._prioritizedPieces = []

     this._missing = end - start + 1
     // Should adapt itself to avoid latency
     this._criticalLength = Math.min((1024 * 1024 / pieceLength) | 0, 2) // Took from webtorrent

     this._onReadPiece = this._onReadPiece.bind(this)
     this._onPieceFinished = this._onPieceFinished.bind(this)

     this._torrent.on('readPiece', this._onReadPiece)
     this._torrent.on('pieceFinished', this._onPieceFinished)
   }

   /**
    * Give a high priority to the following pieces
    * @param {Integer} index : starting index that need hight priority
    * @param {Integer} criticalLength : numbers of pieces that need high priority
    */
   _getCriticalPieces (index, criticalLength) {
     for ( var i = 0; i < criticalLength; i++ ) {
       var nextCriticalPiece = index + i
       if (!this._torrent.handle.havePiece(nextCriticalPiece)) {
         this._torrent.handle.piecePriority(nextCriticalPiece, HIGH_PRIORITY)
         this._prioritizedPieces.push(nextCriticalPiece)
       }
     }
   }

   _onPieceFinished (pieceIndex) {
     if (pieceIndex === this._piece) {
       this._torrent.handle.readPiece(pieceIndex)
     }
   }

   _onReadPiece (piece, err) {
     if (piece.index === this._piece) {

       // If has been destroyed while waiting for piece we do nothing.
       if (this.destroyed) return
       if (err) {
         return this._destroy(err)
       }

       // Remove the offset from the current piece
       if (this._offset) {
         piece.buffer = piece.buffer.slice(this._offset)
         this._offset = 0
       }

       // In case the last piece recieved also contains data from the next file.
       if (this._missing < piece.buffer.length) {
         piece.buffer = piece.buffer.slice(0, this._missing)
       }
       this._missing -= piece.buffer.length
       this._piece += 1

       // Push the data to the stream
       this.push(piece.buffer)

       // We have transfered the all file.
       if (this._missing === 0) {
         // "Passing chunk as null signals the end of the stream (EOF), after which no more data can be written."
         this.push(null)
       }
     }
   }

   // `size` is optional.
  _read (size) {
    // We don't have no more piece to read...
    if (this._missing === 0) return
    if (!this._torrent.handle.havePiece(this._piece)) {
      // Get the next pieces quickly to avoid waiting for the next frame.
      this._getCriticalPieces(this._piece, this._criticalLength)
      return
    }

    this._torrent.handle.readPiece(this._piece)
  }

  _destroy (err, onclose) {
    if (this.destroyed) return
    this.destroyed = true

    // Remove listeners
    this._torrent.removeListener('readPiece', this._onReadPiece)
    this._torrent.removeListener('pieceFinished', this._onPieceFinished)

    // Remove high priority on pieces
    for ( var i = 0; i < this._prioritizedPieces.length; i++ ) {
      var piece = index + i
      this._torrent.handle.piecePriority(piece, NORMAL_PRIORITY)
    }

    // Listened by videostream module ?
    if (err) {
      this.emit('error', err)
    }
    this.emit('close')
    if (onclose) onclose()
  }

  // Needed for compatibility with media-render. It will be called if ReadableStream
  // need to be destroyed.
  destroy (onclose) {
    this._destroy(null, onclose)
  }

 }

export default FileStream
