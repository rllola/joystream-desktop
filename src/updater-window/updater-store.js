import {observable, action, runInAction, computed} from 'mobx'

class UpdaterStore {
  @observable message
  @observable state
  @observable errorMessage

  constructor () {

  }

  @computed get
  isWorking () {
    return this.state === 'checking' || this.state === 'downloading'
  }

  @action.bound
  setMessage (message) {
    this.message = message
  }

  @action.bound
  setState (state) {
    this.state = state
  }

  @action.bound
  setErrorMessage (message) {
    this.errorMessage = message
  }
}

export default UpdaterStore
