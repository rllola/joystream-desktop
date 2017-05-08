class Partition {
  constructor (db) {
    this.db = db
  }

  save (key, value) {
    return new Promise((resolve, reject) => {
      this.db.put(key, value, (err) => {
        if (err) return reject(err)
        resolve()
      })
    })
  }

  remove (key) {
    return new Promise((resolve, reject) => {
      this.db.del(key, (err) => {
        if (err) {
          // silently ignore error when deleteing an entry
        }
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

  getAllStream () {
    return this.db.valueStream()
  }

  getOne (key) {
    return new Promise((resolve, reject) => {
      this.db.get(key, function (err, value) {
        if (err) return resolve(null)
        resolve(value)
      })
    })
  }

  getAllKeys () {
    return new Promise((resolve, reject) => {
      let keys = []

      this.db.keyStream()
        .on('data', function (key) {
          keys.push(key)
        })
        .on('error', reject)
        .on('end', function () {
          resolve(keys)
        })
    })
  }
}

export default Partition
