/**
 * Created by bedeho on 21/10/2017.
 */

function Stopped() {
}

function AlreadyStarted() {
}

function InViable(swarmViability) {
    this.swarmViability = swarmViability // <== this really can never be viable, so all inviable cases within ViabilityOfPaidDownloadingSwarm need to be factored out
}

function InsufficientFunds(estimate, available) {
    this.estimate = estimate
    this.available = available
}

function CanStart(suitablePeers, estimate) {
    this.suitablePeers = suitablePeers
    this.estimate = estimate
}

module.exports = {
    Stopped,
    AlreadyStarted,
    InViable,
    InsufficientFunds,
    CanStart
}

