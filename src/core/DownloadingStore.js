import { observable, action } from 'mobx'

const DownloadingState = {
  InitState: 0
}

class DownloadingStore {

  /**
   * {Number} Current state of the downloading flow
   **/
  @observable state

  constructor (applicationStore, state = DownloadingState.InitState) {
    this.applicationStore = applicationStore
    this.state = state
  }

  @action.bound
  setState (newState) {
    this.state = newState
  }
}

DownloadingStore.State = DownloadingState

export default DownloadingStore
