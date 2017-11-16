// Application mobx store
import { observable, action, computed } from 'mobx'
import { EventEmitter } from 'events'
import State from '../State'

class ApplicationStore extends EventEmitter {

  /**
   * {String} Composite state description for application state machine
   */
  @observable state

  /*
   * {Array{TorrentStores}} All torrent stores
   */
  @observable torrents

  // Will be set to a TorrentStore which is the last torrent being added to the session
  @observable newTorrentBeingAdded = null

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

  /*
   * {Number} Number of satoshies spent during *this session*
   */
  @observable spending

  // Start upoading flow

  /**
   * {String} Path to torrent file currently part of start uploading flow
   */
  @observable startUploadingTorrentFile

  /**
   * {TorrentStore} Torrent store for torrent with bad save path during start upload flow
   */
  @observable torrentWithBadSavePathDuringStartUploadFlow

  /**
   * {Boolean} Blockchain has fully synced
   */
  @observable spvChainSynced

  /**
   * {Number} Blockchain sync progress percet number between 0 and 1
   */
  @observable spvChainSyncProgress

  /**
   * {Number} Current blockchain sync height
   */
  @observable spvChainHeight

  /*
   * {OnboardingStore} Store for onboarding state
   */
  @observable onboardingStore

  constructor (state,
               torrents,
               unconfirmedBalance,
               confirmedBalance,
               revenue,
               spending,
               handlers) {
    super()

    this.setState(state)
    this.torrents = torrents
    this.setUnconfirmedBalance(unconfirmedBalance)
    this.setConfirmedBalance(confirmedBalance)
    this.setRevenue(revenue)
    this.setSpending(spending)

    // Temporary default setting, since changing constuctor signature is
    // currntly an annoyance
    this.setStartUploadingTorrentFile(null)
    this.setTorrentWithBadSavePathDuringStartUploadFlow(null)
    this.setOnboardingStore(null)

    this.setSpvChainSynced(false)
    this.setSpvChainSyncProgress(0)
    this.setSpvChainHeight(0)

    // callbacks to make on user actions
    // (provided by the core application, which will submit them to statemachine as inputs)
    this._handlers = handlers
  }

  @action.bound
  setState (state) {
    this.state = state
  }

  @action.bound
  setUnconfirmedBalance (unconfirmedBalance) {
    this.unconfirmedBalance = unconfirmedBalance
  }

  @action.bound
  setConfirmedBalance (confirmedBalance) {
    this.confirmedBalance = confirmedBalance
  }

  @action.bound
  setRevenue (revenue) {
    this.revenue = revenue
  }

  @action.bound
  setSpending (spending) {
    this.spending = spending
  }

  @action.bound
  setStartUploadingTorrentFile (torrentFile) {
    this.startUploadingTorrentFile = torrentFile
  }

  @action.bound
  setTorrentWithBadSavePathDuringStartUploadFlow (torrentStore) {
    this.torrentWithBadSavePathDuringStartUploadFlow = torrentStore
  }

  @action.bound
  setSpvChainSynced (synced) {
    this.spvChainSynced = synced
  }

  @action.bound
  setSpvChainSyncProgress (progress) {
    this.spvChainSyncProgress = progress
    console.log('Sync Progress:', this.spvChainSyncProgress)
  }

  @action.bound
  setSpvChainHeight (height) {
    this.spvChainHeight = height
    // console.log('Sync Height:', this.spvChainHeight)
  }

  @action.bound
  setOnboardingStore (store) {
    this.onboardingStore = store
  }

  // UI values

  @computed get
  currentState () {
    if (!this.state) {
      return State.NotStarted
    } else if (this.state.startsWith('Started')) {
      return State.Started
    } else if (this.state.startsWith('Starting')) {
      return State.Loading
    } else if (this.state.startsWith('Stopping')) {
      return State.ShuttingDown
    } else if (this.state.startsWith('NotStarted')) {
      return State.NotStarted
    }
  }

  @computed get
  isStarted () {
    return this.state.startsWith('Started')
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
  numberOfTorrentsCompleted () {
    return this.torrentsCompleted.length
  }

  @computed get
  torrentsUploading () {
    return this.torrents.filter(function (torrent) {
      return torrent.showOnUploadingScene
    })
  }

  @computed get
  numberOfTorrentsUploading () {
    return this.torrentsUploading.length
  }

  @computed get torrentsBeingLoaded () {
    return this.torrents.filter(function (torrent) {
      return torrent.isLoading
    })
  }

  @computed get
  torrentsFullyLoadedPercentage () {
    return 100 * (1 - (this.torrentsBeingLoaded.length / this.torrents.length))
  }

  @computed get
  startingTorrentCheckingProgressPercentage () {
    // Compute total size
    let totalSize = this.torrents.reduce(function (accumulator, torrent) {
      return accumulator + torrent.totalSize
    }, 0)

    // Computed total checked size
    let totalCheckedSize = this.torrents.reduce(function (accumulator, torrent) {
      let checkedSize = torrent.totalSize * (torrent.isLoading ? torrent.progress / 100 : 1)
      return accumulator + checkedSize
    }, 0)

    return totalCheckedSize / totalSize * 100
  }

  @computed get
  torrentsBeingTerminated () {
    return this.torrents.filter(function (torrent) {
      return torrent.isTerminating
    })
  }

  @computed get
  terminatingTorrentsProgressPercentage () {
    return this.torrentsBeingTerminated * 100 / this.torrents.length
  }

  @computed get
  totalDownloadSpeed () {
    return this.torrents.reduce(function (accumulator, torrent) {
      return accumulator + torrent.downloadSpeed
    }, 0)
  }

  @computed get
  totalUploadSpeed () {
    return this.torrents.reduce(function (accumulator, torrent) {
      return accumulator + torrent.uploadSpeed
    }, 0)
  }

  @computed get
  activeMediaPlayerStore () {
    for (var i = 0; i < this.torrents.length; i++) {
      if (this.torrents[i].activeMediaPlayerStore) {
        return this.torrents[i].activeMediaPlayerStore
      }
    }
    return null
  }

  @computed get
  totalSpent () {
    var total = 0
    for (var i = 0; i < this.torrents.length; i++) {
      total += this.torrents[i].totalSpent
    }
    return total
  }

  @computed get
  totalRevenue () {
    var total = 0
    for (var i = 0; i < this.torrents.length; i++) {
      total += this.torrents[i].totalRevenue
    }
    return total
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
  setTorrentTerminatingProgress (progress) {
    this.torrentTerminatingProgress = progress
  }

  // Remove Torrent from session
  removeTorrent (infoHash, deleteData) {
    this._handlers.removeTorrent(infoHash, deleteData)
  }

  //  Changing Scenes
  moveToScene (destinationScene) {
    this._handlers.moveToScene(destinationScene)
  }

  // Downloading scene events

  startDownloadWithTorrentFileFromFilePicker () {
    this._handlers.startDownloadWithTorrentFileFromFilePicker()
  }

  startDownloadWithTorrentFileFromDragAndDrop (files) {
    this._handlers.startDownloadWithTorrentFileFromDragAndDrop(files)
  }

  acceptTorrentWasAlreadyAdded () {
    this._handlers.acceptTorrentWasAlreadyAdded()
  }

  acceptTorrentFileWasInvalid () {
    this._handlers.acceptTorrentFileWasInvalid()
  }

  retryPickingTorrentFile () {
    this._handlers.retryPickingTorrentFile()
  }

  // Uploading scene events

  // upload flow

  startTorrentUploadFlow () {
    this._handlers.startTorrentUploadFlow()
  }

  startTorrentUploadFlowWithTorrentFile (files) {
    this._handlers.startTorrentUploadFlowWithTorrentFile(files)
  }

  exitStartUploadingFlow () {
    this._handlers.exitStartUploadingFlow()
  }

  hasTorrentFile () {
    this._handlers.hasTorrentFile()
  }

  hasRawContent () {
    this._handlers.hasRawContent()
  }

  chooseSavePathButtonClicked () {
    this._handlers.chooseSavePathButtonClicked()
  }

  useTorrentFilePathButtonClicked () {
    this._handlers.useTorrentFilePathButtonClicked()
  }

  keepDownloadingClicked () {
    this._handlers.keepDownloadingClicked()
  }

  dropDownloadClicked () {
    this._handlers.dropDownloadClicked()
  }

  // On Boarding
  onBoardingFinished () {
    this._handlers.onBoardingFinished()
  }
}

export default ApplicationStore
