import React, { Component } from 'react'
import { Session, TorrentInfo, TorrentState } from 'joystream-node'
import {ScenarioContainer} from '../common'
import os from 'os'
import path from 'path'

const StreamScenario = () => {

    return (
        <div>
            <ScenarioContainer title="Stream" subtitle="stream sintel video">
            <video width="100%" height="auto" autoPlay controls>
              <source src="https://download.blender.org/durian/movies/sintel_4k.mov" />
            </video>
            </ScenarioContainer>
        </div>
    )
}

export default StreamScenario
