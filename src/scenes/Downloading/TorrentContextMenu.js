/**
 * Created by bedeho on 16/05/17.
 */

import React from 'react'
import PropTypes from 'prop-types'
import isRequiredIf from 'react-proptype-conditional-require'

import SvgIcon from 'material-ui/SvgIcon'

import ContextMenu, {Separator, Item, SwarmItem} from '../../components/ContextMenu'

const PauseItem = (props) => {

    var pauseStatusProps

    if(props.paused) {

        pauseStatusProps = {
            onClick : props.onChangePauseStatus,
            className : "continue-item",
            label : "Continue",
        }

    } else {

        pauseStatusProps = {
            onClick : props.onChangePauseStatus,
            className : "pause-item item-disabled",
            label : "Pause"
        }
    }

    return (
        <Item {...pauseStatusProps}/>
    )
}

const ChangePriceItem = (props) => {

    var changePriceProps

    if(props.changePriceEnabled) {

        changePriceProps = {
            onClick : props.onChangePriceClicked,
            className : "change-price-item"
        }

    } else {

        changePriceProps = {
            onClick: null,
            className: "change-price-disabled-item item-disabled"
        }
    }

    return (
        <Item {...changePriceProps}
              label="Change price" />
    ) // description="Only possible before paid download starts."

}

const RemoveItem = (props) => {
    return (
        <Item onClick={props.onRemoveClicked}
              className="remove-item"
              label="Remove" />
    ) // description="Remove from application only."
}

const RemoveAndDeleteDataItem = (props) => {

    return (
        <Item onClick={props.onRemoveAndDeleteDataClicked}
              className="remove-and-delete-data-item"
              label="Remove & delete data" />
    )
    // description="Removes item from application, and all downloaded data is deleted."
}

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
    number_of_buyers : PropTypes.number.isRequired,
    number_of_sellers : PropTypes.number.isRequired,
    number_of_observers : PropTypes.number.isRequired,
    number_of_normal_peers : PropTypes.number.isRequired
}

export default TorrentContextMenu