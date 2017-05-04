import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class Header extends Component {

  constructor() {
    super()
    /** we need some state here to drive button and wallet stats **/
  }

  render () {
    return (
      <header className="header">

        <img className="logo" src="img/logo-contrast.svg"/>

        <nav>
          <div className="button">Downloading</div>
          <div className="button">Uploading</div>
          <div className="button">Completed</div>
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
