const { protocol } = require('electron')

/**
 * Register the protocol handlers.
 **/
function init() {

  /**
  * Instruction when a protocol called the application.
  * NOTE: What is the difference bewteen register and intercept ?
  */
  protocol.registerStringProtocol('magnet', (request, callback) => {
    console.log(request)
  }, (error) => {
    if (error) console.error('Failed to register protocol')
  })

}

function protocolMagnetCallback (request, callback) {
  console.log(request)
}

function protocolMagnetError () {
  if (error) console.error('Failed to register protocol')
}

exports.default = { init }
