import { observable, action, computed } from 'mobx'
import { BEPSupportStatus } from 'joystream-node'
import ViabilityOfPaidDownloadInSwarm from './ViabilityOfPaidDownloadingSwarm'
import ViabilityOfPaidDownloadingTorrent from './ViabilityOfPaidDownloadingTorrent'

class TorrentStore {

    @observable infoHash
    @observable state
    @observable progress
    @observable totalSize

    /**
     * {String} Path where torrent data is saved and or read from
     */
    @observable savePath

    /**
     * **Temporary, needs be moved onto a pure view store later**
     * {MediaPlayer} Store for currently active streamer on this torrent
     */
    @observable activeMediaPlayerStore

    // Seller minimum price for this torrent
    @observable sellerPrice
    // Map of revenue per connection (using pid as a key)
    @observable sellerRevenue

    // Buyer max price for this torrent
    @observable buyerPrice
    // Map of total spent per connection (using pid as a key)
    @observable buyerSpent

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

    // store the files (see libtorrent::file_storage)
    @observable torrentFiles

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

    @observable viabilityOfPaidDownloadInSwarm

    constructor (applicationStore,
                 torrent,
                 infoHash,
                 savePath,
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
                 viabilityOfPaidDownloadInSwarm,
                 sellerPrice,
                 sellerRevenue,
                 buyerPrice,
                 buyerSpent) {

        this._applicationStore = applicationStore
        this._torrent = torrent
        this.infoHash = infoHash
        this.savePath = savePath
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
        this.viabilityOfPaidDownloadInSwarm = viabilityOfPaidDownloadInSwarm ? viabilityOfPaidDownloadInSwarm : new ViabilityOfPaidDownloadInSwarm.NoJoyStreamPeerConnections()
        this.sellerPrice = sellerPrice ? sellerPrice : 0
        this.sellerRevenue = sellerRevenue ? sellerRevenue : new Map()
        this.buyerPrice = buyerPrice ? buyerPrice : 0
        this.buyerSpent = buyerSpent ? buyerSpent : new Map()

    }

    setTorrent(torrent) {
        this._torrent = torrent
    }

    @action.bound
    setSavePath(savePath) {
        this.savePath = savePath
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
        for(var i in peers) {

            // Get status
            var s = peers[i]._client.status

            if(s.peerBitSwaprBEPSupportStatus !== BEPSupportStatus.supported) {
                normals++
            } else if(s.connection) {

                var announced = s.connection.announcedModeAndTermsFromPeer

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
    setViabilityOfPaidDownloadInSwarm (viabilityOfPaidDownloadInSwarm) {
        this.viabilityOfPaidDownloadInSwarm = viabilityOfPaidDownloadInSwarm
    }

    @action.bound
    setActiveMediaPlayerStore (activeMediaPlayerStore) {
      this.activeMediaPlayerStore = activeMediaPlayerStore
    }

    @action.bound
    setTorrentFiles (torrentFiles) {
      this.torrentFiles = torrentFiles
    }

    @action.bound
    setSellerPrice (sellerTerms) {
      this.sellerPrice = sellerTerms.minPrice
    }

    @action.bound
    setSellerRevenue (pid, amountPaid) {
        this.sellerRevenue.set(pid, amountPaid)
    }

    @action.bound
    setBuyerPrice (buyerTerms) {
      this.buyerPrice = buyerTerms.maxPrice
    }

    @action.bound
    setBuyerSpent (pid, amountPaid) {
        this.buyerSpent.set(pid, amountPaid)
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

    /**
     * Discontinued for now
    @computed get canStartPaidDownloading() {
        return this.state.startsWith("Active.DownloadIncomplete.Unpaid.Started.ReadyForStartPaidDownloadAttempt") &&
                this.suitableSellers != null
    }
    */

    @computed get hasStartedPaidDownloading() {
        return this.state.startsWith("Active.DownloadIncomplete.Paid.Started")
    }

    @computed get canStop() {
        return this.state.startsWith("Active.DownloadIncomplete.Unpaid.Started.ReadyForStartPaidDownloadAttempt") ||
            this.state.startsWith("Active.FinishedDownloading.Uploading.Started")

    }

    @computed get canStart() {
        return this.state.startsWith("Active.DownloadIncomplete.Unpaid.Stopped") ||
            this.state.startsWith("Active.FinishedDownloading.Uploading.Stopped")
    }

    @computed get playableIndexfiles () {
        let playableIndexfiles = []

        for (var i = 0; i < this.torrentFiles.numFiles(); i++) {
          let fileName = this.torrentFiles.fileName(i)
          let fileExtension = fileName.split('.').pop()

          // Need a list of all the video extensions that render-media suport.
          if (fileExtension === 'mp4' || fileExtension === 'wbm' || fileExtension === 'mkv' || fileExtension === 'avi' || fileExtension === 'webm') {
            playableIndexfiles.push(i)
          }
        }

        return playableIndexfiles
    }

    @computed get totalRevenue() {
        var sum = 0
        this.sellerRevenue.forEach(function (value, key, map) {
            sum += value
        })
        return sum
    }

    @computed get totalSpent() {
        var sum = 0
        this.buyerSpent.forEach(function (value, key, map) {
            sum += value
        })
        return sum
    }

    @computed get
    viabilityOfPaidDownloadingTorrent() {

        if(this.state.startsWith("Active.DownloadIncomplete.Unpaid.Stopped"))
            return new ViabilityOfPaidDownloadingTorrent.Stopped()
        else if(this.state.startsWith("Active.DownloadIncomplete.Paid"))
            return new ViabilityOfPaidDownloadingTorrent.AlreadyStarted()
        else if(!(this.viabilityOfPaidDownloadInSwarm instanceof ViabilityOfPaidDownloadInSwarm.Viable))
            return new ViabilityOfPaidDownloadingTorrent.InViable(this.viabilityOfPaidDownloadInSwarm)
        else {

            // Here it must be that swarm is viable, by
            // test in prior step

            if(this._applicationStore.unconfirmedBalance == 0) // <== fix later to be a more complex constraint
                return new ViabilityOfPaidDownloadingTorrent.InsufficientFunds(this.viabilityOfPaidDownloadInSwarm.estimate, this._applicationStore.unconfirmedBalance)
            else
                return new ViabilityOfPaidDownloadingTorrent.CanStart(this.viabilityOfPaidDownloadInSwarm.suitableAndJoined, this.viabilityOfPaidDownloadInSwarm.estimate)
        }

    }

    /// User actions

    start() {
        this._torrent.start()
    }

    stop() {
        this._torrent.stop()
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

    play (fileIndex) {
        this._torrent.play(fileIndex)
    }

}

export default TorrentStore
