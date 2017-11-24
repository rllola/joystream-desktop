import { observable, action } from 'mobx'
import Scene from './Scene'
import { ApplicationSettings } from './ApplicationSettings'
import OnBoardingStore from './OnboardingStore'
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
   * NOTE: Do we need to have it as an obsrevable ? I don't think so.
   */
  @observable applicationStore

  constructor (applicationStore, numberCompletedInBackground = 0) {
    // We need applicatioStore to listen to event
    this.applicationStore = applicationStore

    this.applicationSettings = new ApplicationSettings()

    // set listeners
    /* TEMPORARY
    * We should not listen for applicationStore event but for all the torrents
    * independently
    */
    this.applicationStore.on('torrentFinished', this._torrentFinished.bind(this))

    // Create onBoarding store if it is the first time running the app
    if (this.applicationSettings.isFirstTimeRun()) {
      this.onBoardingStore = new OnBoardingStore(applicationStore)
    }

    // observable initialization
    this.numberCompletedInBackground = numberCompletedInBackground
    this.scene = Scene.Downloading
  }

  @action.bound
  setNumberCompletedInBackground (numberCompletedInBackground) {
    this.numberCompletedInBackground = numberCompletedInBackground
  }

  @action.bound
  setScene (scene) {
    this.scene = scene
  }

  resetNumberCompletedInBackgroundCounter () {
    this.setNumberCompletedInBackground(0)
  }

  _torrentFinished () {
    if (this.scene !== Scene.Completed) {
      this.setNumberCompletedInBackground(this.numberCompletedInBackground + 1)
    }
  }
}

export default UiStore