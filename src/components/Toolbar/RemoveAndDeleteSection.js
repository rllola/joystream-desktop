/**
 * Created by bedeho on 17/08/17.
 */

import React from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'

import ButtonSection from './ButtonSection'

const RemoveAndDeleteSection = observer((props) => {

    // Derive ButtonSection props
    let className = "trash"
    let onClick = () => { props.torrent.remove(true) }
    let tooltip = "Remove & delete data"

    return (
        <ButtonSection className={className} tooltip={tooltip} onClick={onClick} />
    )
})

RemoveAndDeleteSection.propTypes = {
    torrent : PropTypes.object.isRequired, // TorrentStore really
}

export default RemoveAndDeleteSection