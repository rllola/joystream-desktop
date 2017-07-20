const mkdirp = require('mkdirp')
const path = require('path')

class Directories {

  constructor (appDirectory) {
    this.dir = appDirectory
  }

  walletPath () {
    return path.join(this.dir, 'wallet')
  }

  databasePath () {
    return path.join(this.dir, 'data')
  }

  create () {
    const directories = [
      this.dir,
      walletPath(),
      databasePath()
    ]

    directories.forEach((dir) => mkdirp.sync(dir))
  }
}

module.exports = Directories
