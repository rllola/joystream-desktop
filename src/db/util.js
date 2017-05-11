import { TorrentInfo } from 'joystream-node'

// create an object from a torrent handle which can be serialized
// to a JSON string. The handle must be valid or it will return null
// The intent is to store torrent information and flags from the torrent status
// so the the torrent can be added to a session in the future with the same flags
function torrentHandleToStoreValue (handle) {
  if (!handle.isValid()) return null

  let value = {
    infoHash: handle.infoHash(),
    savePath: handle.savePath(),
    uploadLimit: handle.uploadLimit(),
    downloadLimit: handle.downloadLimit()
    //maxUploads:
    //maxConnections:
    //sequentialDownload:
  }

  let ti = handle.torrentFile()

  if (ti) {
    value.name = ti.isValid() ? ti.name() : handle.infoHash()
    value.ti = ti.toBencodedEntry().toString('base64')
  }

  return value

  /*
  enum flags_t {
   flag_seed_mode,
   flag_override_resume_data,
   flag_upload_mode,
   flag_share_mode,
   flag_apply_ip_filter,
   flag_paused,
   flag_auto_managed,
   flag_duplicate_is_error,
   flag_merge_resume_trackers,
   flag_update_subscribe,
   flag_super_seeding,
   flag_sequential_download,
   flag_use_resume_save_path,
   flag_pinned,
   flag_merge_resume_http_seeds,
   flag_stop_when_ready,
  };
  */

  // some additional values to persists from handle.status() that can be restored using flags
  // http://www.libtorrent.org/reference-Core.html#torrent_status
  /* some can be set as flags other are calls on torrent handle
  bool stop_when_ready;
  bool seed_mode;
  bool auto_managed;
  bool ip_filter_applies;
  bool upload_mode;
  bool share_mode;
  */
}

// convert a stored torrent value to an addTorrentParams object
function storeValueToAddTorrentParams (value) {
  let params = {
    name: value.name,
    savePath: value.savePath,
    uploadLimit: value.uploadLimit,
    downloadLimit: value.downloadLimit
  }

  if (value.ti) {
    params.ti = new TorrentInfo(Buffer.from(value.ti, 'base64'))
  } else {
    params.infoHash = value.infoHash
  }

  return params
}

export default {torrentHandleToStoreValue, storeValueToAddTorrentParams}
