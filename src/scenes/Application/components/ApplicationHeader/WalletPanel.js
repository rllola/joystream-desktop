/**
 * Created by bedeho on 10/09/17.
 */

import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {observer} from 'mobx-react'
import {getCompactBitcoinUnits} from './../../../../common'

function getStyles(props) {

    return {
        root :  {
            display: 'flex',
            flexDirection :  'column',
            alignItems: 'center',
            justifyContent: 'center',
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

@observer
class BalancePanel extends Component {

    // We need state here, in order to control visibility
    // - currency: fiat vs bitcoin
    // - value: confirmed vs unconfirmed

    constructor(props) {
        super(props)
    }

    render () {

        let style = getStyles(this.props)

        let representation = getCompactBitcoinUnits(this.props.applicationStore.unconfirmedBalance)
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
    applicationStore : PropTypes.object.isRequired,

    balanceColor : PropTypes.string.isRequired,
    subtitleColor : PropTypes.string.isRequired
}

function getBalanceUnits(unconfirmedBalance, balanceUnits) {
    return 'bits'
}

import LinearProgress from 'material-ui/LinearProgress'
import CircularProgress from 'material-ui/CircularProgress'

const SynchronizationProgressPanel = observer((props) => {

    let styles = {
        root :  {
            display: 'flex',
            flexDirection :  'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '170px'
        },
        circularProgress : {
          marginBottom : '10px'
        },
        progress : {
            //height : '5px',
            marginBottom : '6px',
            backgroundColor : props.subtitleColor,
            overflow: 'hidden'
        },
        subtitle : {
            color: props.subtitleColor,
            fontSize: '11px',
            fontWeight: 'bold',
            position: 'relative'
        }
    }

    let mode = 'determinate' //props.applicationStore.spvChainSyncProgress < 0.1 ? 'indeterminate' : 'determinate'

    return (
        <div style={styles.root}>

            <CircularProgress color={props.subtitleColor}
                              size={20}
                              style={styles.circularProgress}
            />

            <LinearProgress color={props.balanceColor}
                            value={100*props.applicationStore.spvChainSyncProgress}
                            style={styles.progress}
                            mode={mode}
            />

            <div style={styles.subtitle}> SYNCHRONIZING WALLET</div>
        </div>
    )
})

const WalletPanel = observer((props) => {

    let styles = {
        root : {
            display: 'flex',
            flex: '0 0 220px',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: props.backgroundColor
        }
    }

    return (
        <div style={styles.root}>
                <BalancePanel applicationStore={props.applicationStore}
                      balanceColor={props.balanceColor}
                      subtitleColor={props.subtitleColor} />
            {
                props.applicationStore.spvChainSynced ? null
                : <SynchronizationProgressPanel applicationStore={props.applicationStore}
                                                balanceColor={props.balanceColor}
                                                subtitleColor={props.subtitleColor} />

            }
            {props.children}
        </div>
    )
})

WalletPanel.propTypes = {
    applicationStore : PropTypes.object.isRequired,

    backgroundColor : PropTypes.string.isRequired,
    balanceColor : PropTypes.string.isRequired,
    subtitleColor : PropTypes.string.isRequired
}

export default WalletPanel
