import http from 'http'
import fs from 'fs'
import mime from 'mime'

const PORT = 8888
const HOST = 'localhost'


class StreamServer {
  constructor (torrentFile) {

    this.server = http.createServer(function (req, res) {

      var total = torrentFile.size

      res.setHeader('Content-Type', mime.getType(torrentFile.name))

      // Support range-requests
      res.setHeader('Accept-Ranges', 'bytes')

      // meaning client (browser) has moved the forward/back slider
      // which has sent this request back to this server logic ... cool
      if (req.headers.range) {

        var range = req.headers.range
        var parts = range.replace(/bytes=/, '').split('-')
        var partialstart = parts[0]
        var partialend = parts[1]

        var start = parseInt(partialstart, 10)
        var end = partialend ? parseInt(partialend, 10) : total - 1
        var chunksize = (end - start) + 1
        console.log('RANGE: ' + start + ' - ' + end + ' = ' + chunksize)

        var stream = torrentFile.createReadStream({start: start, end: end})
        res.writeHead(206, { 'Content-Range': 'bytes ' + start + '-' + end + '/' + total, 'Content-Length': chunksize })
        stream.pipe(res)

      } else {
        console.log('ALL: ' + total)
        res.writeHead(200, { 'Content-Length': total })
        torrentFile.createReadStream().pipe(res)
      }
    })
  }

  start () {
    this.server.listen(PORT, HOST)
  }
}

export default StreamServer