class Storage {
  constructor (db) {
    this.db = db
  }

  save (value) {
    return new Promise((resolve, reject) => {
      this.db.put(value.infoHash, value, (err) => {
        if (err) return reject(err)
        resolve()
      })
    })
  }

  remove (key) {
    return new Promise((resolve, reject) => {
      this.db.del(key, (err) => {
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

  getOne (key) {
    return new Promise((resolve, reject) => {
      this.db.get(key, function (err, value) {
        if (err) return resolve(null)
        resolve(value)
      })
    })
  }
}

export default Storage
