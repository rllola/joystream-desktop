// babel-polyfill for generator (async/await)
import 'babel-polyfill'

// React
import React from 'react'
import ReactDOM from 'react-dom'

// Main component
import App from './App'

console.log(process.env.PORT)
console.log(process.env.SAVE_PATH)

ReactDOM.render(
  <App />,
  document.getElementById('root')
)
