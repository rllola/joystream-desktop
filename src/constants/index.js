import path from 'path'
import os from 'os'

export const TELEGRAM_URL = "http://www.telegram.com/JoyStream"
export const SLACK_URL = "http://slack.joystream.co"
export const REDDIT_URL = "http://reddit.com/r/JoyStream"

export const POST_TORRENT_UPDATES_INTERVAL = 3000
export const AUTO_UPDATE_BASE_URL ='https://download.joystream.co:7070/update/'

let TORRENTS_PATH = path.join(__dirname, '..', 'assets', 'torrents', path.sep)

function makeFullTorrentPath(fileName) {
    return TORRENTS_PATH + fileName
}

export const EXAMPLE_TORRENTS = [
    makeFullTorrentPath('sintel.torrent'),
    makeFullTorrentPath('glass-half-full.torrent'),
    makeFullTorrentPath('cosmos-laundromat.torrent'),

    //makeFullTorrentPath('elephants-dream.torrent'),

    // The following torrents cannot be played by render-media
    // in genuine streaming mode, so we discontinue for now.
    // NB: Some of these are also larger than the 200MB default
    // blob limit, and hence this would also need to be adgusted!

    // makeFullTorrentPath('big-buck-bunny.torrent'),
    // makeFullTorrentPath('tears-of-steel.torrent'),
]

// Not used - just keeping them here as hint to use in future
//export const DEFAULT_TORRENT_FILE_SOURCE_LOCATION = os.homedir()
//export const DEFAULT_SAVE_PATH= path.join(os.homedir(), 'joystream', 'download', path.sep)
