import React, { Component } from 'react'
import { HashRouter as Router, Route } from 'react-router-dom'
import { Provider } from 'mobx-react'

// components
import Sidebar from './Sidebar'

// Views
import Downloading from './Downloading'
import Seeding from './Seeding'
import Wallet from './Wallet'

export default class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      walletOpened: false
    }
  }

  componentDidMount () {
    this.props.stores.walletStore.open().then(() => {
      this.setState({walletOpened: true})
      this.props.stores.walletStore.connect()
    })
  }

  render () {
    return (
      this.state.walletOpened ?
      <Router>
        <Provider {...this.props.stores}>
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
