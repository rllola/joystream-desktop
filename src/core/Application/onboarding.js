import Store from 'electron-config'
import pjson from '../../../package.json'
import { SINTEL_ON_BOARDING_TORRENT } from '../../constants'
import vc from 'version_compare'

const store = new Store()


// Verify if we are running the application for the first time ever.
function isRunningForTheFirstTime () {

  if (store.has('latestVersionRunned')) {
    return false
  }
  return true

}

// Tell if we are running a new major version of the application
function isAMajorUpdate () {

  let latestVersionRunned = store.get('latestVersionRunned')
  let currentVersionRunning = pjson.version

  if (isRunningForTheFirstTime) return true
  if (vc.lt(latestVersionRunned, currentVersionRunning)) {

    let v1 = currentVersionRunning.split('.')
    let v2 = latestVersionRunned.split('.')

    if (v1[0] > v2[0] || v1[1] > v2[1]) {
      return true
    }

    return false
  }
}

function updateLatestVersionRunned () {
  store.set('latestVersionRunned', pjson.version)
}

export { isRunningForTheFirstTime, updateLatestVersionRunned }
