import { observable, action, computed } from 'mobx'
import State from './State'
import Scene from './Scene'

class UiStore {

  /**
   * {Number} Current scene
   */
  @observable scene

  /**
   * {Number} Number of torrents completed while the
   * user was not on the Completed scene.
   */
  @observable numberCompletedInBackground

  /**
   * {Store} Mobx store for the application
   */
  @observable applicationStore

  constructor (applicationStore, numberCompletedInBackground = 0) {
    // We need applicatioStore to listen to event
    this.applicationStore = applicationStore

    // set listeners
    //this.applicationStore.on('torrentFinished', this._torrentFinished.bind(this))

    // observable initialization
    this.numberCompletedInBackground = numberCompletedInBackground
    this.scene = Scene.Downloading
  }

  @action.bound
  setNumberCompletedInBackground (numberCompletedInBackground) {
    this.numberCompletedInBackground = numberCompletedInBackground
  }

  resetNumberCompletedInBackgroundCounter () {
    this.setNumberCompletedInBackground(0)
  }

  _torrentFinished () {
    if ( scene !== Scene.Completed) {
      this.setNumberCompletedInBackground(this.numberCompletedInBackground + 1)
    }
  }
}

export default UiStore
