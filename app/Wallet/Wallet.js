import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import QRCode from 'qrcode-react'

// Wallet implemented as a functional stateless component
function Wallet(props) {
    const walletStore = props.walletStore

    if (walletStore.address == null)
        return null

    return (
      <div style={{marginTop: '20px'}} className="col-10">
        <h3>Wallet</h3>
        <p>Balance : {walletStore.balance}</p>
        <QRCode value={walletStore.address.toString()} />
        <p>Address : {walletStore.address.toString()}</p>
      </div>
    )
}

export default inject('walletStore')(observer(Wallet))
