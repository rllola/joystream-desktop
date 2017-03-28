import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'

@inject('walletStore')
@observer
class Wallet extends Component {
  render () {
    return (
      <div style={{marginTop: '20px'}} className="col-10">
        <h3>Wallet</h3>
        <p>Wallet view</p>
        <p>Balance : {this.props.walletStore.balance}</p>
        <p>Address : {this.props.walletStore.getAddress().toString()}</p>
      </div>
    )
  }
}

export default Wallet
