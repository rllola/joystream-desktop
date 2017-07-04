/**
 * Created by bedeho on 04/07/17.
 */

import Torrent from '../../../src/core/Torrent/Statemachine/'

var my_client = {}
var torrent = Torrent.handle(my_client, 'startLoading', infoHash, savePath, resumeData, metadata, deepInitialState, extensionSettings)