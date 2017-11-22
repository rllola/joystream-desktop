/**
 * Created by bedeho on 05/10/2017.
 */

const ElectronConfig = require('electron-config')

const FIRST_TIME_RUN_KEY = "firstTimeRun" // Whether
const LAST_VERSION_OF_APP_RUN_KEY = "lastVersionOfAppRun"

function ApplicationSettings() {

    this.electronConfigStore = new ElectronConfig()
}

ApplicationSettings.prototype.isFirstTimeRun = function () {
    // Read whether its a first time run, if no key is set, we pretend it is
    return process.env.FORCE_ONBOARDING || this.electronConfigStore.get(FIRST_TIME_RUN_KEY, true)
}

ApplicationSettings.prototype.setIsFirstTimeRun = function(firstTimeRun) {
    this.electronConfigStore.set(FIRST_TIME_RUN_KEY, firstTimeRun)
}

ApplicationSettings.prototype.lastVersionOfAppRun = function() {
    this.electronConfigStore.get(LAST_VERSION_OF_APP_RUN_KEY)
}

ApplicationSettings.prototype.setLastVersionOfAppRun = function(version) {
    this.electronConfigStore.set(LAST_VERSION_OF_APP_RUN_KEY, version)
}

module.exports.ApplicationSettings = ApplicationSettings
