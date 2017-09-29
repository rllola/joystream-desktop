const electron = require('electron')
const request = require('request')

const APP_VERSION = require('../package.json').version
const AUTO_UPDATE_BASE_URL = require('./constants').AUTO_UPDATE_BASE_URL
const AUTO_UPDATE_FEED_URL = AUTO_UPDATE_BASE_URL + process.platform + '/' + APP_VERSION

function init (feedUrl = AUTO_UPDATE_FEED_URL) {
  // Auto updates not available on linux
  if (process.platform === 'linux') return

  checkForUpdate(feedUrl, function (err, releaseName) {
    if (!err) {
      // If update is available, prompt user if they want to download it or not
      electron.dialog.showMessageBox({
        type: 'question',
        buttons: ['Download', 'Cancel'],
        defaultId: 0,
        message: 'A new version of JoyStream is available, do you want to download it now?',
        title: `Download version ${releaseName}`
      }, response => {
        if (response === 0) downloadUpdate(feedUrl)
      })
    }
  })
}

function checkForUpdate (feedUrl, callback) {
  request({url: feedUrl}, function (err, response, body) {
    if (err) return callback(err)

    if (response.statusCode === 200) {
      try {
        var updateInfo = JSON.parse(body)
      } catch (e) {
        return callback(new Error('failed to parse response from server'))
      }
      callback(null, updateInfo.name)
    } else {
      callback(new Error('Update Not Found'))
    }
  })
}

function downloadUpdate (feedUrl) {
  // Electron autoUpdater checks for update and automatically downloads update if available
  // it doesn't give user a choice
  electron.autoUpdater.setFeedURL(feedUrl)
  electron.autoUpdater.checkForUpdates()
}

electron.autoUpdater.on('error', (err) => {
  electron.dialog.showMessageBox({
    type: 'error',
    defaultId: 0,
    message: `Update Error: ${err.message}`,
    title: 'Update Error'
  })
})

// When update has been downloaded
electron.autoUpdater.on('update-downloaded', confirmInstallation)

// Prompt user if they want to install update or not
function confirmInstallation (event, releaseNotes, releaseName) {
  electron.dialog.showMessageBox({
    type: 'question',
    buttons: ['Install', 'Cancel'],
    defaultId: 0,
    message: 'Latest version downloaded, do you want to install it now?',
    title: `Update to version ${releaseName}`
  }, response => {
    if (response === 0) {
      electron.autoUpdater.quitAndInstall()
    }
  })
}

module.exports = {
  init
}
