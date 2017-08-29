import { observable, action, computed } from 'mobx'

class TorrentStore {

    @observable infoHash
    @observable state
    @observable progress
    @observable totalSize

    // Is playing video/audio
    @observable isPlaying = false

    /**
     * libtorrent::torrent_status::total_done
     *
     * The total number of bytes of the file(s) that we have.
     * All this does not necessarily has to be downloaded during
     * this session (that's total_payload_download).
     */
    @observable downloadedSize

    @observable downloadSpeed
    @observable uploadSpeed

    /**
     * libtorrent::torrent_status::total_download/total_upload
     *
     * The number of bytes downloaded and uploaded to all peers, accumulated, this session only.
     * The session is considered to restart when a torrent is paused and restarted again.
     * When a torrent is paused, these counters are reset to 0. If you want complete, persistent,
     * stats, see all_time_upload and all_time_download.
     *
     */
    @observable uploadedTotal
    @observable name
    @observable numberOfBuyers
    @observable numberOfSellers
    @observable numberOfObservers

    @observable numberOfNormalPeers
    @observable numberOfSeeders

    @observable suitableSellers

    constructor (torrent,
                 infoHash,
                 state,
                 progress,
                 totalSize,
                 downloadedSize,
                 downloadSpeed,
                 uploadSpeed,
                 uploadedTotal,
                 name,
                 numberOfBuyers,
                 numberOfSellers,
                 numberOfObservers,
                 numberOfNormalPeers,
                 numberOfSeeders,
                 suitableSellers) {

        this._torrent = torrent
        this.infoHash = infoHash
        this.state = state
        this.progress = progress ? progress : 0
        this.totalSize = totalSize ? totalSize : 0
        this.downloadedSize = downloadedSize ? downloadedSize : 0
        this.downloadSpeed = downloadSpeed ? downloadSpeed : 0
        this.uploadSpeed = uploadSpeed ? uploadSpeed : 0
        this.uploadedTotal = uploadedTotal ? uploadedTotal : 0
        this.name = name ? name : ''
        this.numberOfBuyers = numberOfBuyers ? numberOfBuyers : 0
        this.numberOfSellers = numberOfSellers ? numberOfSellers : 0
        this.numberOfObservers = numberOfObservers ? numberOfObservers : 0
        this.numberOfNormalPeers = numberOfNormalPeers ? numberOfNormalPeers : 0
        this.numberOfSeeders = numberOfSeeders ? numberOfSeeders : 0
        this.suitableSellers = suitableSellers ? suitableSellers : []
    }

    setTorrent(torrent) {
        this._torrent = torrent
    }

    @action.bound
    setMetadata(metadata) {
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
    setDownloadedSize(downloadedSize) {
        this.downloadedSize = downloadedSize
    }

    @action.bound
    setDownloadSpeed(downloadSpeed) {
        this.downloadSpeed = downloadSpeed
    }

    @action.bound
    setUploadSpeed(uploadSpeed) {
        this.uploadSpeed = uploadSpeed
    }

    @action.bound
    setUploadedTotal(uploadedTotal) {
        this.uploadedTotal = uploadedTotal
    }

    @action.bound
    setStatus (status) {

        this.setProgress(100*status.progress)
        this.setDownloadSpeed(status.downloadRate)
        this.setUploadSpeed(status.uploadRate)
        this.setDownloadedSize(status.totalDone)
        this.setUploadedTotal(status.totalUpload)
        this.setNumberOfSeeders(status.numSeeds)
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

    @action.bound
    setNumberOfSeeders(numberOfSeeders) {
        this.numberOfSeeders = numberOfSeeders
    }

    @action.bound
    setSuitableSellers (suitableSellers) {
        this.suitableSellers = suitableSellers
    }

    @action.bound
    setIsPlaying (isPlaying) {
      this.isPlaying = isPlaying
    }

    /// Scene selector

    @computed get isLoading() {
        return this.state.startsWith("Loading")
    }

    @computed get
    isTerminating() {
        return this.state.startsWith('Terminating')
    }

    @computed get showOnDownloadingScene () {
        return this.state.startsWith("Active.DownloadIncomplete")
    }

    @computed get showOnCompletedScene () {
        return this.state.startsWith("Active.FinishedDownloading")
    }

    @computed get showOnUploadingScene () {
        return this.state.startsWith("Active.FinishedDownloading.Uploading")
    }

    /// User action guards

    @computed get canChangeBuyerTerms () {
        if (this.state.startsWith("Active.DownloadIncomplete.Unpaid.Started")) return true
        if (this.state.startsWith('Loading.WaitingForMissingBuyerTerms')) return true
        return false
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
        return this.state.startsWith("Active.DownloadIncomplete.Unpaid.Started.ReadyForStartPaidDownloadAttempt") &&
                this.suitableSellers != null

    }

    @computed get canStop() {
        return this.state.startsWith("Active.DownloadIncomplete.Unpaid.Started.ReadyForStartPaidDownloadAttempt") ||
            this.state.startsWith("Active.FinishedDownloading.Uploading.Started")

    }

    @computed get canStart() {
        return this.state.startsWith("Active.DownloadIncomplete.Unpaid.Stopped") ||
            this.state.startsWith("Active.FinishedDownloading.Uploading.Stopped")
    }

    /// User actions

    start() {
        this._torrent.start()
    }

    stop() {
        this._torrent.stop()
    }

    remove(deleteData) {
        this._torrent.remove(deleteData)
    }

    openFolder() {
        this._torrent.openFolder()
    }

    startPaidDownload() {
        this._torrent.startPaidDownload()
    }

    beginUploading() {
        this._torrent.beginUpload()
    }

    endUploading() {
        this._torrent.endUpload()
    }

    play () {
        this._torrent.play()
    }

    close () {
        this._torrent.close()
    }
}

export default TorrentStore
