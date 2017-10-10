import {ipcRenderer} from 'electron'

// babel-polyfill for generator (async/await)
import 'babel-polyfill'

// React
import React from 'react'
import ReactDOM from 'react-dom'

import UpdaterWindow from './components'
import UpdaterStore from './UpdaterStore.js'
import pjson from '../../../package.json'

var store = new UpdaterStore()

var blockClosingWindow = true

// NB: These should be in store really...

function checkForUpdate () {
  store.setState('checking')
  ipcRenderer.send('auto-updater-channel', 'check-for-update')
}

function downloadUpdate () {
  store.setState('downloading')
  ipcRenderer.send('auto-updater-channel', 'download-update')
}

function quitAndInstall () {
  store.setState('installing')
  ipcRenderer.send('auto-updater-channel', 'install')
}

// Listen to events from the auto-updater running in the main process
ipcRenderer.on('auto-updater-channel', function (event, command, arg) {
  switch (command) {
    case 'quit':
      blockClosingWindow = false
      break
    case 'update-available':
      store.setMostRecentVersion(arg) // releaseName
      store.setState('waiting-to-start-download')
      break
    case 'no-update-available':
      store.setState('no-update-available')
      break
    case 'error':
      // Error checking for update or downloading update
      store.setErrorMessage(arg)
      store.setState('error')
      break
    case 'downloaded':
      store.setState('waiting-to-start-install')
      break
  }
})

ReactDOM.render(
  <UpdaterWindow store={store}
                 installedVersionString={pjson.version}
                 onUseOldVersionClicked={() => { window.close() }}
                 onUpdateClicked={downloadUpdate}
                 onInstallClicked={quitAndInstall}
                 onErrorCloseClicked={() => { window.close() }}
  />,
  document.getElementById('root'))

// Prevent window closing while downloading an update unless main app is exiting
window.onbeforeunload = function (e) {
  if (store.state === 'downloading' && blockClosingWindow) {
    e.returnValue = false
  }
}

checkForUpdate()
