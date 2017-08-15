// Application mobx store

import {observable, action, runInAction, computed} from 'mobx'

import Scene from './Scene'

class ApplicationStore {

  @observable state

  // Holds all TorrentStores - used to compute array of torrents for the active scene
  @observable torrents

  // Updated while torrents are being loaded during Starting phase of the application
  @observable torrentsToLoad = 0
  @observable torrentLoadingProgress = 0 // Number between 0 and 1 (0% --> 100%)

  // Updated while terminating torrents during Stopping phase of the application
  @observable torrentsToTerminate = 0
  @observable torrentTerminatingProgress = 0 // Number between 0 and 1 (0% --> 100%)

  // Will be set to a TorrentStore which is the last torrent being added to the session
  @observable newTorrentBeingAdded = null

  /**
   * {Number} Number of torrents completed while the
   * user was not on the Completed scene.
   */
  @observable numberCompletedInBackground

  /**
   * {Number} Number of unconfirmed satoshies in wallet
   */
  @observable unconfirmedBalance

  /**
   * {Number} Number of confirmed satoshies in wallet
   */
  @observable confirmedBalance

  /*
   * {Number} Number of satoshies earned during *this session*
   */
  @observable revenue

  constructor (state,
               torrents,
               numberCompletedInBackground,
               unconfirmedBalance,
               confirmedBalance,
               revenue,
               handlers) {

    this.setState(state)
    this.torrents = torrents
    this.setNumberCompletedInBackground(numberCompletedInBackground)
    this.setUnconfirmedBalance(unconfirmedBalance)
    this.setConfirmedBalance(confirmedBalance)
    this.setRevenue(revenue)

    // callbacks to make on user actions
    // (provided by the core application, which will submit them to statemachine as inputs)
    this._handlers = handlers
  }

  @action.bound
  setState (state) {
    this.state = state
  }

  @action.bound
  setNumberCompletedInBackground(numberCompletedInBackground) {
      this.numberCompletedInBackground = numberCompletedInBackground
  }

  @action.bound
  setUnconfirmedBalance(unconfirmedBalance) {
    this.unconfirmedBalance = unconfirmedBalance
  }

  @action.bound
  setConfirmedBalance(confirmedBalance) {
    this.confirmedBalance = confirmedBalance
  }

  //@action.bound
  setRevenue(revenue) {
    this.revenue = revenue
  }

  /// UI values

  @computed get
  activeScene () {

    if (!this.state)
      return Scene.NotStarted
    else if (this.state.startsWith('Started.OnCompletedScene'))
      return Scene.Completed
    else if (this.state.startsWith('Started.OnDownloadingScene'))
      return Scene.Downloading
    else if (this.state.startsWith('Started.OnUploadingScene'))
      return Scene.Uploading
    else if (this.state.startsWith('Starting'))
      return Scene.Loading
    else if (this.state.startsWith('Stopping'))
      return Scene.ShuttingDown
    else if (this.state.startsWith('NotStarted'))
      return Scene.NotStarted

  }

  @computed get
  isStarted () {
    return this.state.startsWith('Started')
  }

  @computed get
  isLoading () {
    return this.activeScene === Scene.Loading
  }

  @computed get
  torrentsDownloading () {
    return this.torrents.filter(function (torrent) {
      return torrent.showOnDownloadingScene
    })
  }

  @computed get
  numberOfTorrentsDownloading () {
    return this.torrentsDownloading.length
  }

  @computed get
  torrentsCompleted () {
    return this.torrents.filter(function (torrent) {
      return torrent.showOnCompletedScene
    })
  }

  @computed get
  numberOfTorrentsCompleted() {
    return this.torrentsCompleted.length
  }

  @computed get
  torrentsUploading () {
    return this.torrents.filter(function (torrent) {
      return torrent.showOnUploadingScene
    })
  }

  @computed get
  numberOfTorrentsUploading() {
    return this.torrentsUploading.length
  }

  @computed get torrentsBeingLoaded() {
    return this.torrents.filter(function (torrent) {
        return torrent.isLoading
    })
  }

  @action.bound
  torrentRemoved (infoHash) {
    this.torrents.replace(this.torrents.filter(function (t) {
      return t.infoHash !== infoHash
    }))
  }

  @action.bound
  torrentAdded (torrent) {
    this.torrents.push(torrent)
  }

  @action.bound
  setTorrentsToLoad (count) {
    this.torrentsToLoad = count
  }

  @action.bound
  setTorrentLoadingProgress (progress) {
    this.torrentLoadingProgress = progress
  }

  @action.bound
  setTorrentsToTerminate (count) {
    this.torrentsToTerminate = count
  }

  @action.bound
  setTorrentTerminatingProgress (progress) {
    this.torrentTerminatingProgress = progress
  }

  //  Changing Scenes
  moveToScene (destinationScene) {
    this._handlers.moveToScene(destinationScene)
  }

  /// Downloading scene events

  startDownload() {
    this._handlers.startDownload()
  }

  acceptTorrentFileAlreadyAdded() {
    this._handlers.acceptTorrentWasAlreadyAdded()
  }

  acceptTorrentFileWasInvalid() {
    this._handlers.acceptTorrentFileWasInvalid()
  }

}

export default ApplicationStore
