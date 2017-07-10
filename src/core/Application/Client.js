
// Method names: API / Inteface expected from client by the application state machine
const api = [
  'reportError',
  'setConfig',
  'getConfig',
  'initializeResources',
  'initializeDatabase',
  'initializeSpvNode',
  'initializeWallet',
  'connectToBitcoinNetwork',
  'loadTorrentsFromDatabase',
  'terminateTorrents',
  'disconnectFromBitcoinNetwork',
  'closeWallet',
  'closeSpvNode',
  'closeDatabase',
  'clearResources',
  'uiShowDownloadingScene',
  'uiResetDownloadingNotificationCounter',
  'uiShowUploadingScene',
  'uiResetUploadingNotificationCounter',
  'uiShowCompletedScene',
  'uiResetCompletedNotificationCounter'
]

module.exports.create = function createClientFromObject (obj) {
  var facade = {}

  api.forEach(function (name) {
    var methodName = '_' + name

    var func = obj[methodName]

    if (typeof func !== 'function') {
      throw new Error('object missing ' + methodName + ' implementation')
    }

    facade[name] = func.bind(obj)
  })

  return facade
}
