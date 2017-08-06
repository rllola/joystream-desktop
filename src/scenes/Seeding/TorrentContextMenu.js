/**
 * Created by bedeho on 16/05/17.
 */

import React from 'react'
import PropTypes from 'prop-types'
import isRequiredIf from 'react-proptype-conditional-require'

import SvgIcon from 'material-ui/SvgIcon'

import ContextMenu, {Separator, PauseItem, ChangePriceItem, RemoveItem, RemoveAndDeleteDataItem, SwarmItem} from '../../components/ContextMenu'

const TorrentContextMenu = (props) => {

    return (
        <ContextMenu onOutsideContextMenuClicked={props.onOutsideContextMenuClicked}>

            <PauseItem {...props}/>

            <ChangePriceItem {...props}/>

            <Separator full={true}/>

            <RemoveItem {...props}/>

            <RemoveAndDeleteDataItem {...props}/>

            <Separator full={true}/>

            <SwarmItem {...props}/>

        </ContextMenu>
    )

}

TorrentContextMenu.propTypes = {
    onOutsideContextMenuClicked : PropTypes.func.isRequired, // whenver a click is made outside the context menu is made

    paused : PropTypes.bool.isRequired,
    onChangePauseStatus : PropTypes.func.isRequired, // whether paused or not

    changePriceEnabled: PropTypes.bool.isRequired,
    onChangePriceClicked : isRequiredIf(PropTypes.func, props => props.changePriceEnabled, 'onChangePriceClicked is required when changePriceEnabled is true'),

    onRemoveClicked : PropTypes.func.isRequired,
    onRemoveAndDeleteDataClicked : PropTypes.func.isRequired,
    numberOfBuyers : PropTypes.number.isRequired,
    numberOfSellers : PropTypes.number.isRequired,
    numberOfObservers : PropTypes.number.isRequired,
    numberOfNormalPeers : PropTypes.number.isRequired
}

export default TorrentContextMenu
