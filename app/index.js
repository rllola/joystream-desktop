// babel-polyfill for generator (async/await)
import 'babel-polyfill'

// React
import React from 'react'
import ReactDOM from 'react-dom'

// Main component
import App from './App'

ReactDOM.render(
  <App />,
  document.getElementById('root')
)
