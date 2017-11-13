import { observable, action } from 'mobx'
import Scene from './Scene'

class UiStore {

  /**
   * {String} Name of the current scene
   */
  @observable scene

  /**
   * {Number} Number of torrents completed while the
   * user was not on the Completed scene.
   */
  @observable numberCompletedInBackground

  constructor (applicationEvent, numberCompletedInBackground = 0) {
    // We need applicatioStore to listen to event
    this.applicationEvent = applicationEvent

    // set listeners

    this.applicationEvent.on('torrentFinished', this._torrentFinished.bind(this))

    // observable initialization
    this.numberCompletedInBackground = numberCompletedInBackground
    this.scene = Scene.NotStarted
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
