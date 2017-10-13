
const template = [
  {
    label: 'View',
    submenu: [
      {role: 'toggledevtools'}
    ]
  },
  {
    role: 'window',
    submenu: [
      {role: 'minimize'},
      {role: 'close'}
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click () { require('electron').shell.openExternal('http://joystream.co/') }
      }
    ]
  }
]

export { template }
