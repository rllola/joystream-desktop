/**
 * Created by bedeho on 05/10/2017.
 */
import ElectronConfig from 'electron-config'

const FIRST_TIME_RUN_KEY = 'firstTimeRun' // Whether
const LAST_VERSION_OF_APP_RUN_KEY = 'lastVersionOfAppRun'

class ApplicationSettings {
  constructor () {
    this.electronConfigStore = new ElectronConfig()
  }

  isFirstTimeRun () {
    // Read whether its a first time run, if no key is set, we pretend it is
    return process.env.FORCE_ONBOARDING || this.electronConfigStore.get(FIRST_TIME_RUN_KEY, true)
  }

  setIsFirstTimeRun (firstTimeRun) {
    this.electronConfigStore.set(FIRST_TIME_RUN_KEY, firstTimeRun)
  }

  lastVersionOfAppRun () {
    this.electronConfigStore.get(LAST_VERSION_OF_APP_RUN_KEY)
  }

  setLastVersionOfAppRun (version) {
    this.electronConfigStore.set(LAST_VERSION_OF_APP_RUN_KEY, version)
  }
}

export default ApplicationSettings
