class Storage {
  constructor (db) {
    this.db = db
  }

  save (torrent) {
    console.log('saving torrent to database:', torrent.infoHash)
    return new Promise((resolve, reject) => {
      this.db.put(torrent.infoHash, torrent, (err) => {
        if (err) return reject(err)
        resolve()
      })
    })
  }

  remove (infoHash) {
    return new Promise((resolve, reject) => {
      this.db.del(infoHash, (err) => {
        if (err) return reject(err)
        resolve()
      })
    })
  }

  getAll () {
    return new Promise((resolve, reject) => {
      let all = []

      this.db.valueStream()
        .on('data', function (data) {
          all.push(data)
        })
        .on('error', reject)
        .on('end', function () {
          resolve(all)
        })
    })
  }
}

export default Storage
