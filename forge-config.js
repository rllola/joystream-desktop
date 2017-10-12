 /* electron-forge config section that normally goes into package.json, can only contain JSON
  * so the config has been moved into this javascript file to add some logic, like getting some
  * config values from the environment variables
 {
   "config": {
      "forge": {

      }
   }
 }
*/

var path = require('path')

// Return a local file path to the location of the cert (PEX format)
function getSigningCertFilePath () {
  return process.env['ELECTRON_FORGE_ELECTRON_WINSTALLER_CONFIG_CERTIFICATE_FILE']
}

// Password for decrypting signing cert
function getSigningCertPassword () {
  return process.env['ELECTRON_FORGE_ELECTRON_WINSTALLER_CONFIG_CERTIFICATE_PASSWORD']
}

// Wether to do OSX code-signing
function getOsxSign () {
  return Boolean(process.env['ELECTRON_FORGE_OSX_SIGN'])
}

module.exports = {
  "make_targets": {
    "win32": [
      "squirrel"
    ],
    "darwin": [
      "dmg",
      "zip"
    ],
    "linux": [
      "deb"
    ]
  },
  "electronPackagerConfig": {
    "asar": true,
    "icon": "src/assets/icons/appicon_128x128",
    "protocol": [
      "joystream",
      "magnet"
    ],
    "ignore": [
      ".gitignore",
      ".travis",
      "appveyor.yml",
      "README.md"
    ],
    "overwrite": true,
    "appCategoryType": "public.app-category.utilities",
    "win32metadata": {
      "CompanyName": "Joystream"
    },
    "osxSign": getOsxSign()
  },
  "electronWinstallerConfig": {
    "name": "Joystream",
    "setupIcon": "src/assets/icons/appicon_128x128.ico",
    "loadingGif": "src/assets/img/windows-installer-screen.png",
    "certificateFile": getSigningCertFilePath(),
    "certificatePassword": getSigningCertPassword()
  },
  "electronInstallerDebian": {
    "icon": "src/assets/icons/appicon_128x128.png",
    "categories": [
      "Utility"
    ],
    "bin" : "Joystream"
  },
  "electronInstallerDMG": {
    "background":"src/assets/img/osx-installer-screen.png",
    "icon": "src/assets/icons/appicon_128x128.png",
    "icon-size": 128,
    "format": "UDZO",
    "contents": [
    {
      x: 700,
      y: 350,
      type: 'link',
      path: '/Applications'
    },
    {
      x: 250,
      y: 350,
      type: 'file',
      path: path.resolve(process.cwd(), 'out/Joystream-darwin-x64/Joystream.app')
    }]
  },
  "github_repository": {
    "owner": "JoyStream",
    "name": "joystream-electron",
    "draft": true,
    "prerelease": false
  },
  "windowsStoreConfig": {
    "packageName": "Joystream"
  }
}
