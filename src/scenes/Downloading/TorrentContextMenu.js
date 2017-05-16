/**
 * Created by bedeho on 16/05/17.
 */

import React from 'react'
import PropTypes from 'prop-types'

import ContextMenu, {Separator, Item, SwarmItem} from '../../components/ContextMenu'

const TorrentContextMenu = (props) => {

    return (
        <ContextMenu top={10} right={10}>

            <Item onClick={() => {console.log("Continue clicked")}}
                  className="icon-continue"
                  label="Continue"/>

            <Item onClick={() => { console.log("Change price clicked")}}
                  className="icon-pause"
                  label="Change price"
                  description="Only applies to future uploads, currently active uploads complete with current price." />

            <Separator/>

            <Item onClick={() => {console.log("Remove clicked")}}
                  className="icon-remove"
                  label="Remove"
                  description="Remove from application only." />

            <Item onClick={() => {console.log("Remove and delete data clicked")}}
                    className="icon-remove-and-delete-data"
                    label="Remove & delete data"
                    description="Removes item from application,  and all downloaded data is deleted."/>
            <Separator/>

            <SwarmItem number_of_buyers={78912} number_of_sellers={378} number_of_observers={221} number_of_normal_peers={542}/>

        </ContextMenu>
    )

}

export default TorrentContextMenu