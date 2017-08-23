/**
 * Created by bedeho on 17/08/17.
 */

import React from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'

import ButtonSection from './ButtonSection'

const RemoveSection = inject('applicationStore')(observer((props) => {

    // Derive ButtonSection props
    let className = "remove"
    let onClick = () => { props.torrent.remove(false) }
    let tooltip = "Remove"

    return (
        <ButtonSection className={className} tooltip={tooltip} onClick={onClick} />
    )
}))

RemoveSection.propTypes = {
    torrent : PropTypes.object.isRequired, // TorrentStore really
}

export default RemoveSection
