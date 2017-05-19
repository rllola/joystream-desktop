import React, { Component } from 'react'
import { HashRouter as Router, Route } from 'react-router-dom'
import { Provider } from 'mobx-react'
import { observer } from 'mobx-react'

// Components
import Sidebar from './components/Sidebar'

// Our scenes
import Downloading from '../Downloading'
import Seeding from '../Seeding'
import Completed from '../Completed'
import Wallet from '../Wallet'

let MobxReactDevTools
if (process.env.NODE_ENV === 'development') {
  console.log('Development')
  MobxReactDevTools = require('mobx-react-devtools').default
}

@observer
class Application extends Component {
  render () {
    return (
      <Router>
        <Provider {...this.props.stores}>
          <div className="container-fluid">
            <div className="row">
              <Sidebar />
              <Route exact path="/" component={Downloading} />
              <Route exact path="/seeding" component={Seeding} />
              <Route exact path="/completed" component={Completed} />
              <Route exact path="/wallet" component={Wallet} />
              {process.env.NODE_ENV === 'development' ? <div><MobxReactDevTools/></div> : null}
            </div>
          </div>
        </Provider>
      </Router>
    )
  }
}

export default Application
