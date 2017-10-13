const electron = require('electron')
const {app, BrowserWindow, ipcMain, crashReporter} = require('electron')
const path = require('path')
const url = require('url')
const isDev = require('electron-is-dev')
const updater = require('./updater')

import {enableLiveReload} from 'electron-compile'


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win = null


// This method makes your application a Single Instance Application -
// instead of allowing multiple instances of your app to run,
// this will ensure that only a single instance of your app is running
var shouldQuit = app.makeSingleInstance(function(commandLine, workingDirectory) {

    // Someone tried to run a second instance, we should focus our window.
    if (win) {
        if (win.isMinimized()) win.restore()
        win.focus()
    }
});

if (shouldQuit) {
    app.quit()
} else {

    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    app.on('ready', createWindow)

    app.on('activate', () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (win === null) {
            createWindow()
        }
    })
}

// Listen to broadcast channel from main window
ipcMain.on('main-window-channel', (event, arg) => {

    if(arg == 'user-closed-app') {

        // Exit application
        updater.quit()
        app.quit()
    }

})

// Listen if we need to modify window size to fit video or going back to
// application size
ipcMain.on('set-bounds', (event, arg) => {
    // verify if window exist and if we are not already in fullscreen
    if (win && !win.isFullScreen()) {
      // Set the new window size
      win.setContentSize(arg.width, arg.height)
  }
})

// Listen if we need to block the save power feature to avooid the screen going
// black in the middle of a video.
ipcMain.on('power-save-blocker', (event, arg) => {
    const {enable, disable} = require('./power-save-blocker')

    console.log(arg)

    if (arg.enable) {
      // Enable blocker
      enable()
    } else {
      // Disable blocker
      disable()
    }
})

function createWindow () {

    if (isDev) {

        // Enable live reloading : Needs to happen prior to `new BrowserWindow`
        // https://github.com/electron/electron-compile/blob/master/README.md
        enableLiveReload({strategy: 'react-hmr'})
        enableLiveReload({strategy: 'react-hmr'})
    }

  // Create the browser window.
  win = new BrowserWindow({
      width: 1200,
      height: 800,
      minHeight: 700,
      minWidth: 1200,
      frame: true,
      backgroundColor: '#1C262B' // same as rgb(28, 38, 43)
  })

  if (isDev) {

    // Open the DevTools.
    win.webContents.openDevTools()

  } else {

    // Maximize window
    win.maximize()

    // Handle squirrel event. Avoid calling for updates when install
    if(require('electron-squirrel-startup')) {
      console.log('Squirrel events handle')
      app.quit()
      // Hack because app.quit() is not immediate
      process.exit(0)
    }
    // Check for updates
    win.webContents.once("did-frame-finish-load", function (event) {
      updater.init()
    })
  }



  // Load file for the app
  var filename_to_load = process.env.COMPONENT_DEVELOPMENT_MODE ? 'component-development/index.html' : 'index.html'

  win.loadURL(url.format({
    pathname: path.join(__dirname, filename_to_load),
    protocol: 'file:',
    slashes: true
  }))

  crashReporter.start({
    productName: "JoyStream",
    companyName: "joystream",
    submitURL: "https://joystream.sp.backtrace.io:6098/post?format=minidump&token=55e469c9e2258e7fd1b47a8ebd4bdc4ddc16b7521b18d3c34941fe186f660ca8",
    uploadToServer: true
  })

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}
