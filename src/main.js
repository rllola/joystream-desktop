const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const url = require('url')

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

        console.log('was told about user closeing app')

        // Exit application
        app.quit()
    }

})

function createWindow () {

    if (process.env.NODE_ENV === 'development') {
        // Enable live reloading
        // https://github.com/electron/electron-compile/blob/master/README.md
        enableLiveReload({strategy: 'react-hmr'});
    }

    // Create the browser window.
    win = new BrowserWindow({width: 1024, height: 800})

    // Load file for the app
    var filename_to_load = process.env.COMPONENT_DEVELOPMENT_MODE ? 'component-development/index.html' : 'index.html'

    win.loadURL(url.format({
        pathname: path.join(__dirname, filename_to_load),
        protocol: 'file:',
        slashes: true
    }))

    if (process.env.NODE_ENV === 'development') {
        // Open the DevTools.
        win.webContents.openDevTools()
    }

    // Emitted when the window is closed.
    win.on('closed', () => {

        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.

        //win = null
    })
}