/**
 * Created by bedeho on 12/06/17.
 */

const dialog = require('electron').remote.dialog
const BaseMachine = require('../../../../BaseMachine')
const TorrentStatemachine = require('../../../../Torrent/Statemachine')
const TorrentInfo = require('joystream-node').TorrentInfo
const Common = require('./../../Common')

var OnDownloadingScene = new BaseMachine({
  initialState: 'idle',
  states: {

    idle: {

      completed_scene_selected: function (client) {
        this.go(client, '../OnCompletedScene')
      },

      uploading_scene_selected: function (client) {
        this.go(client, '../OnUploadingScene')
      },

      startDownload: function(client) {

          // this._defaultTorrentFileSourceLocation

          // Allow user to pick a torrent file
          var filesPicked = dialog.showOpenDialog({
              title : "Pick torrent file",
              defaultPath: client._defaultTorrentFileSourceLocation,
              filters: [
                  {name: 'Torrent file', extensions: ['torrent']},
                  {name: 'All Files', extensions: ['*']}
              ],
              properties: ['openFile']}
          )

          // If the user did no pick any files, then we are done
          if(!filesPicked || filesPicked.length == 0)
              return

          // Get torrent file name picked
          var torrentFile = filesPicked[0]

          // Load torrent file
          let torrentInfo

          try {
              torrentInfo = new TorrentInfo(torrentFile)
          } catch(e) {

              console.log(e)

              // <Set error_code on store also perhaps?>

              this.transition(client, 'TorrentFileWasInvalid')
              return
          }

          const infoHash = torrentInfo.infoHash()

          // Make sure torrent is not already added
          if(client.torrents.has(infoHash)) {

              this.transition(client, 'TorrentAlreadyAdded')
              return
          }

          // Create torrent
          let torrentStore = client.factories.torrentStore(infoHash,
                                                                '',
                                                                0,
                                                                0,
                                                                0,
                                                                0,
                                                                0,
                                                                0,
                                                                '',
                                                                0,
                                                                0,
                                                                0,
                                                                0,
                                                                [])
          client.store.torrentAdded(torrentStore)

          // Create torrent object and hold on to it
          let torrent = client.factories.torrent(torrentStore)

          //
          torrent.on('transition', function({transition, state}) {

              if(state.startsWith('Active.FinishedDownloading.Passive'))
                  client.processStateMachineInput('torrentFinishedDownloading', infoHash)

          })

          client.torrents.set(infoHash, torrent)

          // Assign core torrent as action handler
          torrentStore.setTorrent(torrent)

          /// Add torrent to libtorrent session

          // Default parameters
          let addParams = {
              ti: torrentInfo,
              name: torrentInfo.name() || infoHash,
              savePath: client.directories.defaultSavePath(),
              flags: {
                  paused: true,
                  auto_managed: false
              }
          }

          // Add to session
          client.services.session.addTorrent(addParams, (err, t) => {

              torrent.addTorrentResult(err, t)

              // NB: Move this processing
              torrent.on('lastPaymentReceived', function (alert) {
                  client.processStateMachineInput('lastPaymentReceived', alert)
              })
          })

          /// Start loading torrent

          // NB: Get from settings data store of some sort
          let terms = Common.getStandardbuyerTerms()

          torrent.startLoading(
              infoHash,
              addParams.name,
              addParams.savePath,
              null, // no resume data
              torrentInfo,
              TorrentStatemachine.DeepInitialState.DOWNLOADING.UNPAID.STARTED,
              {
                  buyerTerms: terms
              }
          )

      },

    },

    TorrentFileWasInvalid : {

        acceptTorrentFileWasInvalid: function (client) {

            // Go back to idle
            this.transition(client, 'idle')
        }
    },

    TorrentAlreadyAdded : {

        acceptTorrentWasAlreadyAdded : function(client) {

            // Go back to idle
            this.transition(client, 'idle')
        }
    }
  }
})


module.exports = OnDownloadingScene
