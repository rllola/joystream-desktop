/**
 * Created by bedeho on 12/08/17.
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
        }
        /**
         PAID : {
          STARTED : 6,
          STOPPED : 7,
        }
         **/
    }
}

module.exports = DeepInitialState