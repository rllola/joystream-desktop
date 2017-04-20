// babel-polyfill for generator (async/await)
import 'babel-polyfill'

// React
import React from 'react'
import ReactDOM from 'react-dom'

// Main component
import Application from './scenes/Application'

// Stores
import stores from './stores'

stores.then(function (stores) {
  ReactDOM.render(
    <Application stores={stores} />,
    document.getElementById('root')
  )
})
