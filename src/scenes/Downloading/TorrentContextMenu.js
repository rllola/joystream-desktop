/**
 * Created by bedeho on 16/05/17.
 */

import React from 'react'
import PropTypes from 'prop-types'
import isRequiredIf from 'react-proptype-conditional-require'

import SvgIcon from 'material-ui/SvgIcon'

import ContextMenu, {Separator, Item, SwarmItem} from '../../components/ContextMenu'

function getPauseStatusProps(props) {

    if(props.paused) {

        return {
            onClick : props.onChangePauseStatus,
            className : "continue-item",
            label : "Continue",
        }

    } else {
        return {
            onClick : props.onChangePauseStatus,
            className : "pause-item",
            label : "Pause"
        }
    }

}

function getChangePriceProps(props) {

    if(props.changePriceEnabled) {

        return {
            onClick : props.onChangePriceClicked,
            className : "change-price-item"
        }

    } else {

        return {
            onClick: null,
            className: "change-price-disabled-item"
        }
    }
}

const TorrentContextMenu = (props) => {

    // Get props for changing pause status
    var changePauseStatusProps = getPauseStatusProps(props)

    // Get props for changing price item
    var changePriceProps = getChangePriceProps(props)

    return (
        <ContextMenu onHide={props.onHide}>

            <Item onClick={changePauseStatusProps.onClick}
                  className={changePauseStatusProps.className}
                  label={changePauseStatusProps.label}/>

            <Item onClick={changePriceProps.onClick}
                  className={changePriceProps.className}
                  label="Change price"
                  description="Only possible before paid download starts." />

            <Separator/>

            <Item onClick={props.onRemoveClicked}
                  className="remove-item"
                  label="Remove"
                  description="Remove from application only." />

            <Item onClick={props.onRemoveAndDeleteDataClicked}
                  className="remove-and-delete-data-item"
                  label="Remove & delete data"
                  description="Removes item from application,  and all downloaded data is deleted."/>

            <Separator/>

            <SwarmItem number_of_buyers={props.number_of_buyers}
                       number_of_sellers={props.number_of_sellers}
                       number_of_observers={props.number_of_observers}
                       number_of_normal_peers={props.number_of_normal_peers}/>

        </ContextMenu>
    )

}

TorrentContextMenu.propTypes = {
    onHide : PropTypes.func,
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