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

### levelDB for electron

If using joystream lib in electron you need to recompile leveldown. for electron.
```
HOME=~/.electron-gyp node-gyp rebuild --target=1.6.2 --arch=x64 --dist-url=https://atom.io/download/electron
```

### Issues with electron-forge and conan

When rebuilding the natives addons using electron-forge, conan might not find his configurations files or recipes. You can fix fix this by creating a symbolic link : `ln -s ~/.conan ~/.electron-gyp/.conan`

Other issue on linux : Cannot find pip modules used with conan. You can create a symbolic link of your `.local?` folder : `ln -s ~/.local ~/.electron-gyp/.local`
