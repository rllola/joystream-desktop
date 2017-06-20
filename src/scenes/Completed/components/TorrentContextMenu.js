import React from 'react'
import PropTypes from 'prop-types'
import isRequiredIf from 'react-proptype-conditional-require'

import SvgIcon from 'material-ui/SvgIcon'

import ContextMenu, { Separator, RemoveItem, RemoveAndDeleteDataItem, SwarmItem} from '../../../components/ContextMenu'


const TorrentContextMenu = (props) => {

    return (
        <ContextMenu onOutsideContextMenuClicked={props.onOutsideContextMenuClicked}>

            <RemoveItem {...props}/>

            <RemoveAndDeleteDataItem {...props}/>

            <Separator full={true}/>

            <SwarmItem {...props}/>

        </ContextMenu>
    )

}

TorrentContextMenu.propTypes = {
    onRemoveClicked : PropTypes.func.isRequired,
    onRemoveAndDeleteDataClicked : PropTypes.func.isRequired,
    numberOfBuyers : PropTypes.number.isRequired,
    numberOfSellers : PropTypes.number.isRequired,
    numberOfObservers : PropTypes.number.isRequired,
    numberOfNormalPeers : PropTypes.number.isRequired
}

export default TorrentContextMenu
