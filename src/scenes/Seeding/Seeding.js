import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import PropTypes from 'prop-types'

import {
    Label,
    LabelContainer,
    MiddleSection,
    SimpleLabel,
    Toolbar,
    ToolbarButton,
    MaxFlexSpacer,
    TorrentCountLabel,
    CurrencyLabel,
    BandwidthLabel
} from  './../../components/MiddleSection'

import TorrentTable from './TorrentTable'
import StartUploadingFlow from './components/StartUploadingFlow'
import ElevatedAutoLitButton from '../../components/ElevatedAutoLitButton'

function getStyles(props) {

    return {
        root : {
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1
        }
    }

}

const Seeding = observer((props) => {

    let styles = getStyles(props)

    let labelColorProps = {
        backgroundColorLeft : props.middleSectionDarkBaseColor,
        backgroundColorRight : props.middleSectionHighlightColor
    }

    return (
        <div style={styles.root}>

            <MiddleSection backgroundColor={props.middleSectionBaseColor}>

                <Toolbar>

                    { /**
                     <ElevatedAutoLitButton title={<div>Start uploading</div>}
                     onClick={() => { props.store.startTorrentUploadFlow()}}
                     hue={120}
                     saturation={50}
                     />
                     **/
                    }

                     <ToolbarButton title="Start uploading"
                     onClick={() => { props.store.startTorrentUploadFlow() }}
                     //iconNode={<AddTorrentIcon/>}
                     />

                </Toolbar>

                <MaxFlexSpacer />

                <LabelContainer>

                    <TorrentCountLabel count={props.store.torrentsUploading.length}
                                       {...labelColorProps}
                    />

                    <CurrencyLabel labelText={"REVENUE"}
                                   satoshies={props.store.totalRevenue}
                                   {...labelColorProps}
                    />

                    <BandwidthLabel labelText={'UPLOAD SPEED'}
                                    bytesPerSecond={props.store.totalUploadSpeed}
                                    {...labelColorProps}
                    />

                </LabelContainer>


            </MiddleSection>

            <TorrentTable torrents={props.store.torrentsUploading} store={props.store} />

            <StartUploadingFlow store={props.store}/>

        </div>
    )
})

Seeding.propTypes = {
    store : PropTypes.object.isRequired,

    //
    middleSectionBaseColor : PropTypes.string.isRequired,
    middleSectionDarkBaseColor : PropTypes.string.isRequired,
    middleSectionHighlightColor : PropTypes.string.isRequired
}

export default Seeding
