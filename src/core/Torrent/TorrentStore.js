import { observable, action, computed } from 'mobx'

// View specific observables and actions

class TorrentStore {

    @observable infoHash
    @observable state
    @observable libtorrentState
    @observable progress
    @observable totalSize
    @observable name
    @observable peers
    @observable numberOfBuyers
    @observable numberOfSellers
    @observable numberOfObservers
    @observable numberOfNormalPeers

    constructor (infoHash, state, libtorrentState, progress, totalSize, name, peers, numberOfBuyers, numberOfSellers, numberOfObservers, numberOfNormalPeers) {

        this.infoHash = infoHash
        this.state = state
        this.libtorrentState = libtorrentState
        this.progress = progress
        this.totalSize = totalSize
        this.name = name
        this.peers = peers
        this.numberOfBuyers = numberOfBuyers
        this.numberOfSellers = numberOfSellers
        this.numberOfObservers = numberOfObservers
        this.numberOfNormalPeers = numberOfNormalPeers
    }

    @action.bound
    setMetadata(metadata) {

        this.metadata = metadata // Not observable

        this.setName(metadata.name())
        this.setTotalSize(metadata.totalSize())
    }

    @action.bound
    setState(state) {
        this.state = state
    }

    @action.bound
    setName (name) {
        this.name = name
    }

    @action.bound
    setTotalSize (totalSize) {
        this.totalSize = totalSize
    }

    @action.bound
    setLibtorrentState (state) {
        this.libtorrentState = state
    }

    @action.bound
    setStatus (status) {

        // status

        //this.setLibtorrentState(state)
        //this.setProgress(progress)
    }

    @action.bound
    setProgress (progress) {
        this.progress = progress
    }

    @action.bound
    setPeers(peers) {
        this.peers = peers

        // Computables
        /**
        this.numberOfBuyers = numberOfBuyers
        this.numberOfSellers = numberOfSellers
        this.numberOfObservers = numberOfObservers
        this.numberOfNormalPeers = numberOfNormalPeers
         */
    }

    /**
    @computed get stateName () {

        switch (this.libtorrentState) {
            case TorrentState.downloading:
                return 'Downloading'
            case TorrentState.downloading_metadata:
                return 'DownloadIncomplete Metadata'
            case TorrentState.finished:
                return 'Finished'
            case TorrentState.seeding:
                return 'Seeding'
            case TorrentState.allocating:
                return 'Allocating'
            case TorrentState.checking_resume_data:
                return 'Checking Resume Data'
            default:
                return ''
        }
    }
    */

    /// User action guards

    @computed get isLoading() {

    }

    @computed get showOnDownloadingScene () {

    }

    @computed get showOnCompletedScene () {

    }

    @computed get showOnUploadingScene () {

    }

    @computed get canChangeBuyerTerms () {

    }

    @computed get canChangeSellerTerms () {

    }

    @computed get canBeginUploading() {

    }

    @computed get canEndUploading() {

    }

    @computed get canStartPaidDownloading() {

    }

    /// User actions

    @action.bound
    start() {

    }

    @action.bound
    stop() {

    }

    @action.bound
    remove(deleteData) {

    }

    @action.bound
    openFolder() {

    }

    @action.bound
    startPaidDownload() {

    }

    @action.bound
    beginUploading() {

    }

    @action.bound
    endUploading() {

    }

}

export default TorrentStore
