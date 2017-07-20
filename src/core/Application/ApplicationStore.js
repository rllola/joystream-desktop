// Application mobx store

import {observable, action, runInAction, computed} from 'mobx'

import Scene from './Scene'
import utils from '../utils'

class ApplicationStore {

  @observable state

  // Holds all TorrentStores - used to compute array of torrents for the active scene
  @observable _torrents = []

  // Updated while torrent sare being loaded when starting the app
  @observable torrentsToLoad = 0
  @observable torrentLoadingProgress = 0

  // Will be set to a TorrentStore which is the last torrent being added to the session
  @observable newTorrentBeingAdded = null

  // notifications in each category
  @observable _notifications = {
    uploading: new Map(),
    downloading: new Map(),
    completed: new Map()
  }

  constructor (handlers) {
    // callbacks to make on user actions
    // (provided by the core application, which will submit them to statemachine as inputs)
    this._handlers = handlers

    // expose the utility methods - is this the right place
    // or should the react components get them directly ?
    this.utils = utils
  }

  @action.bound
  setState (stateString) {
    this.state = stateString
  }

  @computed get activeScene () {
    if (!this.state) return Scene.NotStarted

    if (this.state.startsWith('Started.OnCompletedScene')) {
      this.notifications.completed.clear()
      return Scene.Completed
    }

    if (this.state.startsWith('Started.OnDownloadingScene')) {
      this.notifications.downloading.clear()
      return Scene.Downloading
    }

    if (this.state.startsWith('Started.OnUploadingScene')) {
      this.notifications.uploading.clear()
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
    return this.activeScene() === Scene.Loading
  }

  @computed get _torrentsDownloading () {
    return this._torrents.filter(function (torrent) {
      return torrent.showOnDownloadingScene()
    })
  }

  @computed get _torrentsCompleted () {
    return this._torrents.filter(function (torrent) {
      return torrent.showOnCompletedScene()
    })
  }

  @computed get _torrentsUploading () {
    return this._torrents.filter(function (torrent) {
      return torrent.showOnUploadingScene()
    })
  }

  // Torrents for the active scene
  @computed get torrents () {
    switch (this.activeScene()) {
      case Scene.Downloading: return this._torrentsDownloading()
      case Scene.Uploading: return this._torrentsUploading()
      case Scene.Completed: return this._torrentsCompleted()
      default: return []
    }
  }

  @action.bound
  torrentRemoved (torrent) {
    this._torrents.replace(this._torrents.filter(function (t) {
      // Only someone that has a reference to the torrent store should be able to remove it
      return t !== torrent
      // optionally remove it by infoHash?   return t.infoHash !== infoHash
    }))
  }

  @action.bound
  torrentAdded (torrent) {
    this._torrents.push(torrent)
  }

  @action.bound
  addNotificationOnTorrent (torrentStore) {
    var setNotification = (category) => {
      this._notifications[category].set(torrentStore.infoHash, true)
    }

    // Only set notification if torrent not in current scene
    var scene = this.activeScene()
    if (!isTorrentInScene(torrentStore, scene)) {
      if (scene === Scene.Downloading) {
        if (torrentStore.showOnUploadingScene()) {
          setNotification('uploading')
        } else if (torrentStore.showOnCompletedScene()) {
          setNotification('completed')
        }
      } else if (scene === Scene.Uploading) {
        if (torrentStore.showOnDownloadingScene()) {
          setNotification('downloading')
        } else if (torrentStore.showOnCompletedScene()) {
          setNotification('completed')
        }
      } else if (scene === Scene.Complated) {
        if (torrentStore.showOnDownloadingScene()) {
          setNotification('downloading')
        } else if (torrentStore.showOnUploadingScene()) {
          setNotification('uploading')
        }
      }
    }
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

  @action.bound
  setTorrentsToLoad (count) {
    this.torrentsToLoad = count
  }

  @action.bound
  setTorrentLoadingProgress (progress) {
    this.torrentLoadingProgress = progress
  }

  // The UI should this method passing in a TorrentInfo object (after displaying info to user)
  //, or string (magnetlink or infohash)
  @action.bound
  addTorrent (info, /* settings? */) {
    this._handlers.addTorrent(info)
  }

  @action.bound
  clearTorrentBeingAdded () {
    this.newTorrentBeingAdded = null
  }

  @action.bound
  setTorrentBeingAdded (torrentStore) {
    if (this.isStarted()) this.newTorrentBeingAdded = torrentStore
  }

  //  Changing Scenes
  moveToScene (destinationScene) {
    this._handlers.moveToScene(destinationScene)
  }
}

function isTorrentInScene (torrentStore, scene) {
  if(torrentStore.showOnDownloadingScene() && (scene == Scene.Downloading)) return true
  if(torrentStore.showOnUploadingScene() && (scene == Scene.Uploading)) return true
  if(torrentStore.showOnCompletedScene() && (scene == Scene.Completed)) return true
  return false
}

// function clearNotificationOnTorrents (torrents) {
//   torrents.forEach((torrent) => torrent.clearNotification())
// }
//
// function getNotificationCount (torrents) {
//   return torrents.reduce((total, torrent) => {
//     return total + (torrent.hasNotification() ? 1 : 0)
//   }, 0)
// }

export default ApplicationStore
