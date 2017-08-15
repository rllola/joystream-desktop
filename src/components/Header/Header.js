/**
 * Created by bedeho on 30/05/17.
 */

import React, { Component } from 'react'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'

import Button from './Button'
import Panel from './Panel'
import Scene from '../../core/Application/Scene'

const Header = observer((props) => {

    return (
        <div className="header">

            <img className="logo" src="assets/img/logo-contrast.svg"/>

            <nav>
                <Button isActive={props.app.activeScene == Scene.Downloading}
                        onClick={() => { props.app.moveToScene(Scene.Downloading)}}
                        label="Downloading"
                        value={props.app.numberOfTorrentsDownloading}
                />

                <Button isActive={props.app.activeScene == Scene.Uploading}
                        onClick={() => { props.app.moveToScene(Scene.Uploading)}}
                        label="Uploading"
                        value={props.app.numberOfTorrentsUploading}
                />

                <Button isActive={props.app.activeScene == Scene.Completed}
                        onClick={() => { props.app.moveToScene(Scene.Completed)}}
                        label="Completed"
                        value={props.app.numberOfTorrentsCompleted}
                        notificationCount={props.app.numberCompletedInBackground}
                />
            </nav>

            <div className="flex-spacer"></div>

            <Panel label={"Balance"}
                   quantity={props.app.unconfirmedBalance}
            />

        </div>
    )
})

Header.propTypes = {
    app : PropTypes.object.isRequired
}

export default Header
