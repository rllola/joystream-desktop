import React, { Component } from 'react'
import { HashRouter as Router, Route } from 'react-router-dom'
import { Provider } from 'mobx-react'

// components
import Sidebar from './Sidebar'

// Views
import Downloading from './Downloading'
import Seeding from './Seeding'
import Wallet from './Wallet'

// Stores
import joystreamStore from './stores/Joystream'
import walletStore from './stores/Wallet'

const stores = { joystreamStore, walletStore }

class App extends Component {
  constructor() {
    super()

    this.state = {
      walletOpened: false
    }
  }

  componentDidMount () {
    walletStore.open().then(() => {
      this.setState({walletOpened: true})
    })
  }

  render () {
    return (
      this.state.walletOpened ?
      <Router>
        <Provider {...stores}>
          <div className="container-fluid">
            <div className="row">
              <Sidebar />
              <Route exact path="/" component={Downloading} />
              <Route exact path="/seeding" component={Seeding} />
              <Route exact path="/wallet" component={Wallet} />
            </div>
          </div>
        </Provider>
      </Router>
      :
      null
    )
  }
}

export default App
