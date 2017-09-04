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

  defaultSavePath () {
    return path.join(this.dir, 'download')
  }

  create () {
    const directories = [
      this.dir,
      this.walletPath(),
      this.databasePath()
    ]

    directories.forEach((dir) => mkdirp.sync(dir))
  }
}

module.exports = Directories
