/**
 * Created by bedeho on 20/08/17.
 */

/**
 * Created by bedeho on 29/05/17.
 */

import React from 'react'
import {ScenarioContainer} from '../common'
import {
    Button,
    SideBar,
    SideBarFrame
} from '../../components/SideBar'

const SideBarScenarios = () => {

    return (
        <div>

            <ScenarioContainer title="Basic sidebar">
                <SideBar>

                    <Button title={"downloads"}
                            onClick={() => { console.log("click: hello 1")}}
                            iconUrl=""/>

                    <Button onClick={() => { console.log("click: hello 2")}}
                            iconUrl=""/>

                    <Button title={"finished"}
                            onClick={() => { console.log("click: hello 3")}}
                            iconUrl=""/>

                </SideBar>
            </ScenarioContainer>

        </div>
    )
}



export default SideBarScenarios
