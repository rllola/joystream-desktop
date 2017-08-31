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
    ChangeTermsButton,
    UploadButton,
    DowloadButton,
    FinishedButton,
    WalletButton,
    CommunityButton,
    LivestreamButton,
    SideBar
} from '../../components/SideBar'

const BasicSideBar = (props) => {

    return (
        <SideBar backgroundColor="#202F53">

            <UploadButton
                onClick={() => { console.log("click: hello 1")}}
            />

            <DowloadButton
                onClick={() => { console.log("click: hello 2")}}
            />

            <FinishedButton
                selected={true}
                onClick={() => { console.log("click: hello 2")}}
            />

            <WalletButton viewBox={'0 0 48 48'}
                onClick={() => { console.log("click: hello 2")}}
            />

            <CommunityButton viewBox={'0 0 48 48'}
                selected={true}
                onClick={() => { console.log("click: hello 2")}}
            />

            <LivestreamButton
                onClick={() => { console.log("click: hello 3")}}
            />

        </SideBar>
    )

}

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
            <BasicSideBar />
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
                <div><BasicSideBar /></div>
                <div>hh</div>
            </div>
        </ScenarioContainer>
    )

}



export default SideBarScenarios
