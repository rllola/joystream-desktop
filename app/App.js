import React, { Component } from 'react'
import { HashRouter as Router, Route } from 'react-router-dom'

import Sidebar from './Sidebar'
import Downloading from './Downloading'
import Seeding from './Seeding'
import Wallet from './Wallet'

class App extends Component {
  render () {
    return (
      <Router>
        <div className="container-fluid">
          <div className="row">
              <Sidebar />
              <Route exact path="/" component={Downloading}/>
              <Route exact path="/seeding" component={Seeding}/>
              <Route exact path="/wallet" component={Wallet}/>
          </div>
        </div>
      </Router>
    )
  }
}

export default App
