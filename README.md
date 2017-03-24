# Electron app

Joystream app in electron.

## Before install

You need to get `joystream-node` and `libtorrent-node` if you already had them on your computer you need to update the recipes.

In `joystream-node`, you will need to create a link for npm so it can be used in it this application. In the repo do `npm link` then build the library for electron following the instruction in the README.

If you already had the `joystream-electron`, remove the `node_modules` folder and do `npm install` to have a fresh install.
Then do `npm link joystream-node`

## Start

```
npm start
```

## Notes

### Where do we start joystream ?

Joystream library could be added in the main process or the rendering process. For now it is located in the rendering process.


### levelDB for electron

If using joystream lib in electron you need to recompile leveldown. for electron.
```
HOME=~/.electron-gyp node-gyp rebuild --target=1.6.2 --arch=x64 --dist-url=https://atom.io/download/electron
```
