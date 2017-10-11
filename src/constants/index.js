import path from 'path'
import os from 'os'

export const POST_TORRENT_UPDATES_INTERVAL = 3000
export const AUTO_UPDATE_BASE_URL ='https://download.joystream.co:7070/update/'
export const SINTEL_ON_BOARDING_TORRENT = path.join(__dirname, '..', 'assets', 'torrents', path.sep) + 'sintel.torrent'

let TORRENTS_PATH = path.join(__dirname, '..', 'assets', 'torrents', path.sep)

export const EXAMPLE_TORRENTS = [
    TORRENTS_PATH + 'sintel.torrent',
    TORRENTS_PATH + 'big-buck-bunny.torrent',
    TORRENTS_PATH + 'cosmos-laundromat.torrent',
    TORRENTS_PATH + 'tears-of-steel.torrent'
]

// Not used - just keeping them here as hint to use in future
//export const DEFAULT_TORRENT_FILE_SOURCE_LOCATION = os.homedir()
//export const DEFAULT_SAVE_PATH= path.join(os.homedir(), 'joystream', 'download', path.sep)
