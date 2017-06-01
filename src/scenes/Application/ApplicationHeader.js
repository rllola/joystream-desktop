/**
 * Created by bedeho on 30/05/17.
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Header, {Button} from '../Header/Header'
import Scene from './Scene'

const ApplicationHeader = (props) => {

    return (
        <Header balance={props.balance}>

            <Button isActive={props.activeScene == Scene.Downloading}
                    onClick={() => { props.onSceneSelected(Scene.Downloading)}}
                    label="Downloading"/>

            <Button isActive={props.activeScene == Scene.Seeding}
                    onClick={() => { props.onSceneSelected(Scene.Seeding)}}
                    label="Seeding"/>

            <Button isActive={props.activeScene == Scene.Completed}
                    onClick={() => { props.onSceneSelected(Scene.Completed)}}
                    label="Completed"/>
        </Header>
    )
}

ApplicationHeader.propTypes = {

    // Quantity (satoshies) of currency in wallet
    balance : PropTypes.number.isRequired,

    // Which scene is currently active
    activeScene : PropTypes.oneOf(Object.values(Scene)).isRequired,

    // Triggered when scene selection button is clicked
    onSceneSelected : PropTypes.func.isRequired
}

export default ApplicationHeader