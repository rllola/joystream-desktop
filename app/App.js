import React, { Component } from 'react'
import { HashRouter as Router, Route } from 'react-router-dom'
import { Provider } from 'mobx-react'
import MobxReactDevTools from 'mobx-react-devtools'

// components
import Sidebar from './Sidebar'

// Views
import Downloading from './Downloading'
import Seeding from './Seeding'
import Wallet from './Wallet'
import { observer } from 'mobx-react'

export default
@observer
class App extends Component {
  constructor(props) {
    super(props)
  }

  render () {
    return (
      <Router>
        <Provider {...this.props.stores}>
          <div className="container-fluid">
            <div className="row">
              <Sidebar />
              <Route exact path="/" component={Downloading} />
              <Route exact path="/seeding" component={Seeding} />
              <Route exact path="/wallet" component={Wallet} />
              <div><MobxReactDevTools/></div>
            </div>
          </div>
        </Provider>
      </Router>
    )
  }
}
