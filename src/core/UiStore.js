import { observable, action } from 'mobx'

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

  constructor (numberCompletedInBackground = 0) {
    this.numberCompletedInBackground = numberCompletedInBackground
  }

  @action.bound
  setNumberCompletedInBackground (numberCompletedInBackground) {
    this.numberCompletedInBackground = numberCompletedInBackground
  }

}

export default UiStore
