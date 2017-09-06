/**
 * Created by bedeho on 20/08/17.
 */

/**
 * Created by bedeho on 29/05/17.
 */

import React from 'react'
import {ScenarioContainer} from '../common'
import ApplicationHeader from '../../scenes/Application/components/ApplicationHeader'

import ApplicationStore from '../../core/Application/ApplicationStore'
import Scene from '../../core/Application/Scene'

const ApplicationHeaderScenarios = () => {

    var applicationStore = new ApplicationStore(
        'Started.OnDownloadingScene',
        [],
        12,
        2351212,
        12321,
        553,
        21,
        {
            addNewTorrent: () => { console.log("adding new torrent")},
            moveToScene: (s) => {

                console.log("moveToScene:" + s)

                if (s == Scene.Completed)
                    applicationStore.setState('Started.OnCompletedScene')
                else if (s == Scene.Downloading)
                    applicationStore.setState('Started.OnDownloadingScene')
                else if (s == Scene.Uploading)
                    applicationStore.setState('Started.OnUploadingScene')
            }
        })

    return (
        <ScenarioContainer title="Basic sidebar">
            <ApplicationHeader app={applicationStore} />
        </ScenarioContainer>
    )
}

export default ApplicationHeaderScenarios
