import React from 'react'
import btcConvert from 'bitcoin-convert'
import PropTypes from 'prop-types'

const BitcoinConvert = (props) => {
  let value = 0
  let unit = null
  switch (Math.ceil(Math.log(props.satoshis + 1) / Math.LN10)) {
    case 1:
    case 2:
      value = props.satoshis
      unit = 'Sat'
      break
    case 3:
    case 4:
    case 5:
      if (props.satoshis % 100 === 0) {
        value = btcConvert(props.satoshis, 'Satoshi', 'μBTC')
      } else {
        value = btcConvert(props.satoshis, 'Satoshi', 'μBTC').toFixed(2)
      }
      unit = 'μBTC'
      break
    case 6:
    case 7:
    case 8:
      if (props.satoshis % 100000 === 0) {
        value = btcConvert(props.satoshis, 'Satoshi', 'mBTC')
      } else {
        value = btcConvert(props.satoshis, 'Satoshi', 'mBTC').toFixed(2)
      }
      unit = 'mBTC'
      break
    default:
      if (props.satoshis % 100000000 === 0) {
        value = btcConvert(props.satoshis, 'Satoshi', 'BTC')
      } else {
        value = btcConvert(props.satoshis, 'Satoshi', 'BTC').toFixed(2)
      }
      unit = 'BTC'
      break
  }
  return (<span>{value} {unit}</span>)
}

BitcoinConvert.propTypes = {
  satoshis: PropTypes.number.isRequired
}

export default BitcoinConvert
