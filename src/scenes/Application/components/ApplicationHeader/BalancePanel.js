/**
 * Created by bedeho on 10/09/17.
 */

import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {getCompactBitcoinUnits} from './../../../../common'

function getStyles(props) {

    return {
        root :  {
            backgroundColor: props.backgroundColor,
            flex: '0 0 220px',
            alignItems: 'center',
            justifyContent: 'center',
            display: 'flex',
            flexDirection :  'column'
        },
        balance : {
            color : props.balanceColor,
            marginRight : '10px',
            fontSize : '24px',
            fontWeight: 'bold'
        },
        units : {
            color : props.balanceColor,
        },
        subtitle : {
            color: props.subtitleColor,
            fontSize: '11px',
            fontWeight: 'bold',
            //top: '-5px',
            position: 'relative'
        }
    }
}

class BalancePanel extends Component {

    // We need state here, in order to control visibility
    // - currency: fiat vs bitcoin
    // - value: confirmed vs unconfirmed

    constructor(props) {
        super(props)
    }

    render () {

        let style = getStyles(this.props)

        let representation = getCompactBitcoinUnits(this.props.unconfirmedBalance)
        let balanceText = "UNCONFIRMED BALANCE"

        return (
            <div style={style.root}>
                <div>
                    <span style={style.balance}>{representation.value}</span>
                    <span style={style.units}>{representation.unit}</span>
                </div>
                <div style={style.subtitle}>{balanceText}</div>
            </div>
        )
    }
}

BalancePanel.propTypes = {
    unconfirmedBalance : PropTypes.number.isRequired,
    confirmedBalance : PropTypes.number.isRequired,

    backgroundColor : PropTypes.string.isRequired,
    balanceColor : PropTypes.string.isRequired,
    subtitleColor : PropTypes.string.isRequired
}

function getBalanceUnits(unconfirmedBalance, balanceUnits) {
    return 'bits'
}

export default BalancePanel