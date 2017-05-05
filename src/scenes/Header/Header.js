import React, { Component } from 'react'
import { Link, BrowserRouter, Route} from 'react-router-dom'

class Header extends Component {

  constructor() {
    super()
    /** we need some state here to drive button and wallet stats **/
  }

  // Consider factor out the individual buttons? the header will need onclick handlers anyway.
  render () {
    return (
      <header className="header">

        <img className="logo" src="img/logo-contrast.svg"/>

        <nav>
            <Link to="/" > <div className="button">Downloading</div> </Link>
            <Link to="/seeding" > <div className="button">Uploading</div> </Link>
            <Link to="/completed" > <div className="button">Completed</div> </Link>
            <div className="button" id="more-button"></div>
        </nav>

        <div className="flex-spacer"></div>

        <div className="balance">
          <span id="label">balance</span>
          <span id="quantity">91234 mB</span>
        </div>
      </header>
    )
  }
};

export default Header
