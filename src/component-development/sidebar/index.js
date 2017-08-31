/**
 * Created by bedeho on 20/08/17.
 */

/**
 * Created by bedeho on 29/05/17.
 */

import React from 'react'
import {ScenarioContainer} from '../common'
import ApplicationSidebar from '../../scenes/Application/components/ApplicationSidebar'


const SideBarScenarios = () => {

    return (
        <div>
            <BasicSidebarScenario/>
            <BasicNavigationScenario/>
        </div>
    )
}

const BasicSidebarScenario = () => {

    return (
        <ScenarioContainer title="Basic sidebar">
            <ApplicationSidebar />
        </ScenarioContainer>
    )
}

const BasicNavigationScenario = () => {

    var style = {
        display : 'flex',
        margin : '40px',
        border : '2px solid grey',
        borderRadius : '3px'
    }

    return (
        <ScenarioContainer title="Basic navigation">
            <div style={style}>
                <div><ApplicationSidebar /></div>
                <div>hh</div>
            </div>
        </ScenarioContainer>
    )

}



export default SideBarScenarios
