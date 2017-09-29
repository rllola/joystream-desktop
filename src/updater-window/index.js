import {ipcRenderer} from 'electron'

// babel-polyfill for generator (async/await)
import 'babel-polyfill'

// React
import React from 'react'
import ReactDOM from 'react-dom'

import Updater from './updater-ui.js'
import UpdaterStore from './updater-store.js'

var store = new UpdaterStore()

function checkForUpdate () {
  store.setState('checking')
  store.setMessage('Checking for updates...')
  ipcRenderer.send('auto-updater-channel', 'check-for-update')
}

function downloadUpdate () {
  store.setState('downloading')
  store.setMessage('Downloading...')
  ipcRenderer.send('auto-updater-channel', 'download-update')
}

function quitAndInstall () {
  store.setState('installing')
  ipcRenderer.send('auto-updater-channel', 'install')
}

// Listen to events from the auto-updater running in the main process
ipcRenderer.on('auto-updater-channel', function (event, command, arg) {
  switch (command) {
    case 'update-available':
      store.setMessage('A new version of JoyStream is available to download')
      store.setState('waiting-to-start-download')
      break
    case 'no-update-available':
      store.setMessage('You are running the latest version')
      store.setState('done')
      break
    case 'error':
      // Error checking for update or downloading update
      store.setErrorMessage(arg)
      store.setState('done')
      break
    case 'downloaded':
      store.setMessage('Update downloaded and ready to install')
      store.setState('waiting-to-start-install')
      break
  }
})

ReactDOM.render(
  <Updater store={store}
    checkForUpdate={checkForUpdate}
    downloadUpdate={downloadUpdate}
    quitAndInstall={quitAndInstall} />,
  document.getElementById('root'))

checkForUpdate()
