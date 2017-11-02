/**
 * Created by bedeho on 18/10/2017.
 */

import React from 'react'
import PropTypes from 'prop-types'
import { Provider, observer } from 'mobx-react'
import FullScreenContainer from '../../components/FullScreenContainer'
import VideoPlayer from  '../../components/VideoPlayer'

const VideoPlayerScene = observer((props) => {

    if(!props.store.activeMediaPlayerStore)
        return null

    return (
        <FullScreenContainer>
            <VideoPlayer mediaPlayerStore={props.store.activeMediaPlayerStore}/>
        </FullScreenContainer>
    )

})

VideoPlayerScene.propTypes = {
    store : PropTypes.object.isRequired // streaming torrent video player store
}

export default VideoPlayerScene
