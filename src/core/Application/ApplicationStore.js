// Application mobx store

import {observable, action, runInAction, computed} from 'mobx'

import Scene from './Scene'

class ApplicationStore {

  @observable state

  @observable unconfirmedBalance

  @observable confirmedBalance

  // Total revenue
  @observable revenue

  // Holds all TorrentStores - used to compute array of torrents for the active scene
  @observable _torrents = []

  // Updated while torrents are being loaded during Starting phase of the application
  @observable torrentsToLoad = 0
  @observable torrentLoadingProgress = 0 // Number between 0 and 1 (0% --> 100%)

  // Updated while terminating torrents during Stopping phase of the application
  @observable torrentsToTerminate = 0
  @observable torrentTerminatingProgress = 0 // Number between 0 and 1 (0% --> 100%)

  // notifications in each category
  @observable _notifications = {
    uploading: new Map(),
    downloading: new Map(),
    completed: new Map()
  }

  constructor (state, unconfirmedBalance, confirmedBalance, revenue, handlers) {

    this.setState(state)
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
  setUnconfirmedBalance(unconfirmedBalance) {
    this.unconfirmedBalance = unconfirmedBalance
  }

  @action.bound
  setConfirmedBalance(confirmedBalance) {
    this.confirmedBalance = confirmedBalance
  }

  @action.bound
  setRevenue(revenue) {
    this.revenue = revenue
  }

  @computed get activeScene () {

    if (!this.state) return Scene.NotStarted

    if (this.state.startsWith('Started.OnCompletedScene')) {
      this._notifications.completed.clear()
      return Scene.Completed
    }

    if (this.state.startsWith('Started.OnDownloadingScene')) {
      this._notifications.downloading.clear()
      return Scene.Downloading
    }

    if (this.state.startsWith('Started.OnUploadingScene')) {
      this._notifications.uploading.clear()
      return Scene.Uploading
    }

    if (this.state.startsWith('Starting')) return Scene.Loading
    if (this.state.startsWith('Stopping')) return Scene.ShuttingDown
    if (this.state.startsWith('NotStarted')) return Scene.NotStarted
  }

  @computed get
  isStarted () {
    return this.state.startsWith('Started')
  }

  @computed get
  isLoading () {
    return this.activeScene === Scene.Loading
  }

  @computed get _torrentsDownloading () {
    return this._torrents.filter(function (torrent) {
      return torrent.showOnDownloadingScene
    })
  }

  @computed get _torrentsCompleted () {
    return this._torrents.filter(function (torrent) {
      return torrent.showOnCompletedScene
    })
  }

  @computed get _torrentsUploading () {
    return this._torrents.filter(function (torrent) {
      return torrent.showOnUploadingScene
    })
  }

  // Torrents for the active scene
  @computed get torrents () {
    switch (this.activeScene) {
      case Scene.Downloading: return this._torrentsDownloading
      case Scene.Uploading: return this._torrentsUploading
      case Scene.Completed: return this._torrentsCompleted
      default: return []
    }
  }

  @action.bound
  torrentRemoved (infoHash) {
    this._torrents.replace(this._torrents.filter(function (t) {
      return t.infoHash !== infoHash
    }))
  }

  @action.bound
  torrentAdded (torrent) {
    this._torrents.push(torrent)
  }

  @action.bound
  addNotificationOnTorrent (infoHash) {
    var setNotification = (category) => {
      this._notifications[category].set(infoHash, true)
    }

    // look for torrent in active scene
    if(torrentInArray(this.torrents, infoHash)) {
      // torrent is in active scene no need to update the counter
      return
    }

    if(torrentInArray(this._torrentsDownloading, infoHash)) {
      return setNotification('downloading')
    }

    if(torrentInArray(this._torrentsUploading, infoHash)) {
      return setNotification('uploading')
    }

    if(torrentInArray(this._torrentsCompleted, infoHash)) {
      return setNotification('completed')
    }
  }

  @computed get totalDownloadRate() {

    return this._torrentsDownloading.reduce(function(accum, torrentStore) {
      return accum + torrentStore.downloadSpeed
    }, 0)
  }

  @computed get downloadingNotifications () {
    return this._notifications.downloading.size()
  }

  @computed get uploadingNotifications () {
    return this._notifications.uploading.size()
  }

  @computed get completedNotifications () {
    return this._notifications.completed.size()
  }

  @computed get torrentsBeingLoaded() {
    return this._torrents.filter(function (torrent) {
        return torrent.isLoading
    })
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

function torrentInArray (array, infoHash) {
  for (var i in array) {
    if (array[i].infoHash === infoHash) return true
  }
  return false
}

export default ApplicationStore
