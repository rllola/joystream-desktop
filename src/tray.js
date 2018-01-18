import { Tray, Menu } from 'electron'
import { createVersionWindow } from './info-version'

const PATH_TO_APPICON = './src/assets/appicon/'

function createTray (win) {
  const versionWindow = createVersionWindow()
  let pathToIcon = PATH_TO_APPICON + 'icon.png'

  // better to use .ico for windows
  if (process.platform === 'win32') {
    pathToIcon = PATH_TO_APPICON + 'icon.ico'
  }

  var tray = new Tray(pathToIcon)

  // We create the tary menu
  const contextMenu = Menu.buildFromTemplate([
    {label: 'Joystream', click() { if (!win.isVisible()) { win.show() } else { win.focus() } }},
    // For preferences configuration like defaultFolder...
    {label: 'Preferences', click () { win.webContents.send('openPreferences') }},
    // Open joystream website in browser
    {label: 'About', click () { require('electron').shell.openExternal('http://joystream.co/') }},
    // Open joystream website in browser
    {label: 'Version', click () { versionWindow.show() }},
    // Open the chrome console
    {role: 'toggledevtools'},
    {type: 'separator'},
    // Quit the app
    {role: 'quit'}
  ])

  // Show the name of the application when the tray icon is hover
  tray.setToolTip('Joystream')

  // Add the context menu
  tray.setContextMenu(contextMenu)
  return tray
}

export { createTray }
