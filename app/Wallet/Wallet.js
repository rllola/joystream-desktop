import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import QRCode from 'qrcode-react'

@inject('walletStore')
@observer
class Wallet extends Component {
  componentWillMount () {

  }

  render () {
    return (
      <div style={{marginTop: '20px'}} className="col-10">
        <h3>Wallet</h3>
        <p>Balance : {this.props.walletStore.balance}</p>
        <QRCode value={this.props.walletStore.address.toString()} />
        <p>Address : {this.props.walletStore.address.toString()}</p>
      </div>
    )
  }
}

export default Wallet
