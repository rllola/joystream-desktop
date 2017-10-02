const electron = require('electron')
const {BrowserWindow, ipcMain} = electron
const path = require('path')
const url = require('url')

const request = require('request')

const APP_VERSION = require('../package.json').version
const AUTO_UPDATE_BASE_URL = require('./constants').AUTO_UPDATE_BASE_URL
const AUTO_UPDATE_FEED_URL = AUTO_UPDATE_BASE_URL + process.platform + '/' + APP_VERSION

let updaterWindow = null

function createWindow () {
  // Create the updater browser window.
  updaterWindow = new BrowserWindow({
    width: 400,
    height: 200,
    minHeight: 400,
    minWidth: 200,
    frame: true,
    show: false
  })

  updaterWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'updater-window', 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Emitted when the window is closed.
  updaterWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    updaterWindow = null
  })
}

function quit () {
  if (updaterWindow) {
    updaterWindow.webContents.send('auto-updater-channel', 'quit')
  }
}

function init (showWindowOnCreation = false) {
  // Auto updates not available on linux
  if (process.platform === 'linux') return

  // Only create one instance of the updater renderer process
  if (updaterWindow) {
    updaterWindow.show()
  } else {
    // Create the updater process window
    // the renderer initiates check for update by sending an rpc message
    createWindow()

    if (showWindowOnCreation) updaterWindow.show()
  }
}

ipcMain.on('auto-updater-channel', (event, command) => {
  if (command === 'check-for-update') {
    checkForUpdate(function (err, updateAvailable, releaseName) {
      // If user has closed updater window, ignore result
      if (updaterWindow) {
        if (err) {
          if (updaterWindow.isVisible()) updaterWindow.show()
          updaterWindow.webContents.send('auto-updater-channel', 'error', err.message)
        } else {
          if (updateAvailable) {
            // Force show the updater window
            updaterWindow.show()
            updaterWindow.webContents.send('auto-updater-channel', 'update-available', releaseName)
          } else {
            if (updaterWindow.isVisible()) updaterWindow.show()
            updaterWindow.webContents.send('auto-updater-channel', 'no-update-available')
          }
        }
      }
    })
  } else if (command === 'download-update') {
    downloadUpdate()
  } else if (command === 'install') {
    electron.autoUpdater.quitAndInstall()
  } else if (command === 'init') {
    init(true)
  }
})

function checkForUpdate (callback) {
  request({url: AUTO_UPDATE_FEED_URL}, function (err, response, body) {
    if (err) {
      return callback(err)
    }

    if (response.statusCode === 200) {
      try {
        var updateInfo = JSON.parse(body)
      } catch (e) {
        return callback(new Error('failed to parse response body from server'))
      }
      callback(null, true, updateInfo.name)
    } else {
      callback(null, false)
    }
  })
}

function downloadUpdate () {
  // Electron autoUpdater checks for update and automatically downloads update if available
  // it doesn't give user a choice
  electron.autoUpdater.setFeedURL(AUTO_UPDATE_FEED_URL)
  electron.autoUpdater.checkForUpdates()
}

electron.autoUpdater.on('error', (err) => {
  if (updaterWindow) {
    if (updaterWindow.isVisible()) updaterWindow.show()
    updaterWindow.webContents.send('auto-updater-channel', 'error', err.message)
  }
})

electron.autoUpdater.on('update-available', () => {
  if (updaterWindow) {
    if (updaterWindow.isVisible()) updaterWindow.show()
    updaterWindow.webContents.send('auto-updater-channel', 'downloading')
  }
})

// If there is inconsistency in how we check for updates and how electron.autoUpdater is checking we
// will get this event, because we only ask electron.autoUpdater to check for updates if we detect
// and update is available in our custom code checkForUpdates()
electron.autoUpdater.on('update-not-available', () => {
  if (updaterWindow) {
    if (updaterWindow.isVisible()) updaterWindow.show()
    updaterWindow.webContents.send('auto-updater-channel', 'error', 'Update not found')
  }
})

electron.autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
  if (updaterWindow) {
    updaterWindow.show()
    updaterWindow.webContents.send('auto-updater-channel', 'downloaded', event, releaseNotes, releaseName)
  }
})

module.exports = {
  init,
  quit
}
