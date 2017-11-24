import { observable, action } from 'mobx'

const UploadingState = {
  InitState: 0,
  UserSelectingTorrentFileOrRawContent: 1,
  TorrentFileWasInvalid: 2,
  TorrentAlreadyAdded: 3,
  UserPickingSavePath: 4,
  LoadingTorrentForUploading: 5,
  TellUserAboutIncompleteDownload: 6,
  ProvideTorrentFileMetadata: 7,
  GeneratingTorrentFile: 8
}

class UploadingStore {

  @observable state

  constructor (state = UploadingState.InitState) {
    this.state = state
  }

  @action.bound
  setState (newState) {
    this.state = newState
  }

  startTorrentUploadFlow () {
    this.setState(UploadingState.UserSelectingTorrentFileOrRawContent)

    // Allow user to pick a torrent file
    var filesPicked = Common.showNativeTorrentFilePickerDialog()

    // If the user did no pick any files, then we are done
    if (!filesPicked || filesPicked.length === 0) {
      this.setState(UploadingState.InitState)
      return
    }

    // useTorrentFile(this, client, filesPicked[0])
  }
}

UploadingStore.State = UploadingState

export default UploadingStore
