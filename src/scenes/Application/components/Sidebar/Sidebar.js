import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class Sidebar extends Component {
  render () {
    return (
      <div className="col-2">
        <img style={{ width: '100%', marginTop: '20px' }} src="./assets/img/main_logo.png" />
        <br />
        <br />
        <ul className="list-unstyled text-center">
          <li><Link to="/">Download</Link></li>
          <li><Link to="/seeding">Seeding</Link></li>
          <li><Link to="/completed">Completed</Link></li>
          <li><Link to="/wallet">Wallet</Link></li>
        </ul>
      </div>
    )
  }
}

export default Sidebar
