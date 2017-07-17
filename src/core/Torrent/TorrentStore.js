import { observable, action, computed } from 'mobx'

class TorrentStore {

    @observable infoHash
    @observable state
    @observable progress
    @observable totalSize
    @observable name
    @observable numberOfBuyers
    @observable numberOfSellers
    @observable numberOfObservers
    @observable numberOfNormalPeers

    constructor (infoHash,
                 state,
                 progress,
                 totalSize,
                 name,
                 numberOfBuyers,
                 numberOfSellers,
                 numberOfObservers,
                 numberOfNormalPeers,
                 startHandler,
                 stopHandler,
                 removeHandler,
                 openFolderHandler,
                 startPaidDownloadHandler,
                 beginUploadHandler,
                 endUploadHandler) {

        this.infoHash = infoHash
        this.state = state
        this.progress = progress
        this.totalSize = totalSize
        this.name = name
        this.numberOfBuyers = numberOfBuyers
        this.numberOfSellers = numberOfSellers
        this.numberOfObservers = numberOfObservers
        this.numberOfNormalPeers = numberOfNormalPeers
        this.startHandler = startHandler
        this.stopHandler = stopHandler
        this.removeHandler = removeHandler
        this.openFolderHandler = openFolderHandler
        this.startPaidDownloadHandler = startPaidDownloadHandler
        this.beginUploadHandler = beginUploadHandler
        this.endUploadHandler = endUploadHandler
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
    setStatus (status) {

        // ignore other fields for now

        this.setProgress(status.progress)
    }

    @action.bound
    setProgress (progress) {
        this.progress = progress
    }

    // The next seller effectively computes other observables,
    // and the reason we are not using computables from mobx
    // is because it would be wasteful

    @action.bound
    setPeers(peers) {

        //this.peers = peers

        // Counters
        let buyers = 0
        let sellers = 0
        let observers = 0
        let normals = 0

        // Iterate peers and determine type
        for(var i in this.peers) {

            // Get status
            var s = statuses[i]
            var endPoint = s.endPoint

            if(s.peerBitSwaprBEPSupportStatus != BEPSupportStatus.supported) {
                normals++
            } else if(s.connection) {

                var announced = s.connnection.announcedModeAndTermsFromPeer

                if(announced.buyer)
                    buyers++
                else if(announced.seller)
                    sellers++
                else if(announced.observer)
                    observers++
            }

        }

        // Update observables
        this.setNumberOfBuyers(buyers)
        this.setNumberOfSellers(sellers)
        this.setNumberOfObservers(observers)
        this.setNumberOfNormalPeers(normals)
    }

    @action.bound
    setNumberOfBuyers (numberOfBuyers) {
        this.numberOfBuyers = numberOfBuyers
    }

    @action.bound
    setNumberOfSellers (numberOfSellers) {
        this.numberOfSellers = numberOfSellers
    }

    @action.bound
    setNumberOfObservers (numberOfObservers) {
        this.numberOfObservers = numberOfObservers
    }

    @action.bound
    setNumberOfNormalPeers (numberOfNormalPeers) {
        this.numberOfNormalPeers = numberOfNormalPeers
    }

    /// Scene selector

    @computed get isLoading() {
        return this.state.startsWith("Loading")
    }

    @computed get showOnDownloadingScene () {
        return this.state.startsWith("Active.DownloadingIncomplete")
    }

    @computed get showOnCompletedScene () {
        return this.state.startsWith("Active.FinishedDownloading")
    }

    @computed get showOnUploadingScene () {
        return this.state.startsWith("Active.FinishedDownloading.Uploading")
    }

    /// User action guards

    @computed get canChangeBuyerTerms () {
        return this.state.startsWith("Active.DownloadIncomplete.Unpaid.Started")
    }

    @computed get canChangeSellerTerms () {
        return this.state.startsWith("Active.FinishedDownloading.Uploading.Started")
    }

    @computed get canBeginUploading() {
        return this.state.startsWith("Active.FinishedDownloading.Passive")
    }

    @computed get canEndUploading() {
        return this.state.startsWith("Active.FinishedDownloading.Uploading.Started")
    }

    @computed get canStartPaidDownloading() {
        return this.state.startsWith("Active.DownloadIncomplete.Unpaid.Started.CanStartPaidDownload")
    }

    /// User actions

    @action.bound
    start() {
        this.startHandler()
    }

    @action.bound
    stop() {
        this.stopHandler()
    }

    @action.bound
    remove(deleteData) {
        this.removeHandler(deleteData)
    }

    @action.bound
    openFolder() {
        this.openFolderHandler()
    }

    @action.bound
    startPaidDownload() {
        this.startPaidDownloadHandler()
    }

    @action.bound
    beginUploading() {
        this.beginUploadHandler()
    }

    @action.bound
    endUploading() {
        this.endUploadHandler()
    }

}

export default TorrentStore
