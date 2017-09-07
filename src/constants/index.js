import path from 'path'
import os from 'os'

export default {
  POST_TORRENT_UPDATES_INTERVAL: 3000,
  DEFAULT_TORRENT_FILE_SOURCE_LOCATION: os.homedir(),
  DEFAULT_SAVE_PATH: path.join(os.homedir(), 'joystream', 'download', path.sep),
  AUTO_UPDATE_BASE_URL: 'https://download.joystream.co:7070/update/'
}
