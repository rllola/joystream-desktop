/**
 * Created by bedeho on 17/08/17.
 */

import React from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'

import ButtonSection from './ButtonSection'

const RemoveSection = observer((props) => {

    // Derive ButtonSection props
    let className = "remove"
    let onClick = () => { props.store.removeTorrent(props.torrent.infoHash, false) }
    let tooltip = "Remove"

    return (
        <ButtonSection className={className} tooltip={tooltip} onClick={onClick} />
    )
})

RemoveSection.propTypes = {
    store : PropTypes.object.isRequired,
    torrent : PropTypes.object.isRequired
}

export default RemoveSection
