import React, { Component } from 'react'
import PropTypes from 'prop-types'

class OnBoarding extends Component {

  handleClick (event) {
    event.preventDefault()
    this.props.onDoneClick()
  }

  render () {
    return (
      <div className="onBoardingScene">
        <div className="CenterPiece">
          <h2>Hello !</h2>
          <br/>
          <p>Welcome on the testnet version of the joystream application.</p>
          <a href="#" onClick={this.handleClick.bind(this)}> Done </a>
        </div>
      </div>
    )
  }
}

OnBoarding.propTypes = {
  onDoneClick : PropTypes.func.isRequired
}

export default OnBoarding
