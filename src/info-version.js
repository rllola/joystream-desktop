import { app, BrowserWindow } from 'electron'
import path from 'path'
import url from 'url'

function createVersionWindow () {
  // Create a new small window to display the information
  let child = new BrowserWindow({
    width: 250,
    height: 200,
    modal: true,
    show: false
  })

  // Load the html template
  child.loadURL(url.format({
    pathname: path.join(__dirname, 'info.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Show when the html template is loaded
  /* child.once('ready-to-show', () => {
    child.show()
  }) */

  // Need to destroy this window before attempting quitting otherwise this will
  // be prevented because we are intercepting the "close" event and stopping it.
  app.on('before-quit', function () {
    child.destroy()
  })

  // Instead of deleting the window we close it until we want to show it again.
  // It allow us to be more reactive when showing the window (creating a new window take a couple of seconds)
  child.on('close', function (event) {
    event.preventDefault()
    child.hide()
  })

  return child
}

export { createVersionWindow }
