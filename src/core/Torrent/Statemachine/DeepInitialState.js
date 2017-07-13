/**
 * Created by bedeho on 23/06/17.
 */

var DeepInitialState = {
    UPLOADING : {
        STARTED : 1,
        STOPPED : 2,
    },
    PASSIVE : 3,
    DOWNLOADING : {
        UNPAID : {
            STARTED : 4,
            STOPPED : 5,
        },
        PAID : {
            STARTED : 6,
            STOPPED : 7,
        }
    }
}

function isUploading(s) {
    return s == DeepInitialState.UPLOADING.STARTED ||
        s == DeepInitialState.UPLOADING.STOPPED

}

function isPassive(s) {
    return s == DeepInitialState.PASSIVE
}

function isDownloading(s) {
    return s == DeepInitialState.DOWNLOADING.UNPAID.STARTED ||
            s == DeepInitialState.DOWNLOADING.UNPAID.STOPPED ||
            s == DeepInitialState.DOWNLOADING.PAID.STARTED ||
            s == DeepInitialState.DOWNLOADING.PAID.STOPPED
}

function isStopped(s) {

    return s == DeepInitialState.UPLOADING.STOPPED ||
            s == DeepInitialState.DOWNLOADING.UNPAID.STOPPED ||
            s == DeepInitialState.DOWNLOADING.PAID.STOPPED
}

module.exports.DeepInitialState = DeepInitialState
module.exports.isUploading = isUploading
module.exports.isPassive = isPassive
module.exports.isDownloading = isDownloading
module.exports.isStopped = isStopped