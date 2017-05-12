import React, { Component } from 'react'
import { HashRouter as Router, Route } from 'react-router-dom'
import { Provider } from 'mobx-react'
import MobxReactDevTools from 'mobx-react-devtools'
import { observer } from 'mobx-react'


import Header from '../Header'

// Components
import Sidebar from './components/Sidebar'

// Our scenes
import Downloading from '../Downloading'
import Seeding from '../Seeding'
import Completed from '../Completed'
import Wallet from '../Wallet'

@observer
class Application extends Component {

  constructor(props) {
    super(props)
  }

  /* The merits of this providers seems dubious, reconsider later */
  /* Provider needs a single child */
  render () {
    return (
        <Router>
          <Provider {...this.props.stores}>

            <div className="app-container">

                <Header>
                </Header>

                <Route path="/" component={Downloading}/>
                <Route exact path="/seeding" component={Seeding} />
                <Route exact path="/completed" component={Completed} />
                <Route exact path="/wallet" component={Wallet} />

                <div><MobxReactDevTools/></div>

            </div>

          </Provider>
        </Router>
    )
  }
}

/** Downloading revenue={7893} down_speed={924} **/

export default Application
