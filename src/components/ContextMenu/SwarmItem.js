/**
 * Created by bedeho on 10/05/17.
 */

import React from 'react'
import PropTypes from 'prop-types'

import Item from './Item'

/**
 * Stateless react component for information box
 * @param props
 * @returns {XML}
 * @constructor
 */
const InfoBox = (props) => {

    return (
        <div className="info-box">
            <span className="title">{props.title}</span>
            <span className="value">{props.value}</span>
        </div>
    )
}

InfoBox.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired
}

/**
 * Stateless react component for bittorrent swarm information box.
 * @param props : see .propTypes
 * @returns {XML}
 * @constructor
 */
const SwarmItem = (props) => {

    return (
        <Item class="swarm-item" label="Swarm">
            <InfoBox title="BUYERS" value ={props.number_of_buyers} />
            <InfoBox title="SELLERS" value ={props.number_of_sellers} />
            <InfoBox title="OBSERVERS" value ={props.number_of_observers} />
            <InfoBox title="NORMAL" value ={props.number_of_normal_peers} />
        </Item>
    )
}

SwarmItem.propTypes = {
    number_of_buyers : PropTypes.number.isRequired,
    number_of_sellers : PropTypes.number.isRequired,
    number_of_observers : PropTypes.number.isRequired,
    number_of_normal_peers : PropTypes.number.isRequired
}

SwarmItem.InfoBox = InfoBox

export default SwarmItem