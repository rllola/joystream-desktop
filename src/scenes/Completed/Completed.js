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

import { TorrentTable } from './components'

function getStyles(props) {

    return {
        root : {
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1
        }
    }

}

const Completed = observer((props) => {

    let styles = getStyles(props)

    let labelColorProps = {
        backgroundColorLeft : props.middleSectionDarkBaseColor,
        backgroundColorRight : props.middleSectionHighlightColor
    }

    return (
        <div style={styles.root}>

            <MiddleSection backgroundColor={props.middleSectionBaseColor}>

                <MaxFlexSpacer />

                <LabelContainer>

                    <TorrentCountLabel count={props.store.torrentsCompleted.length}
                                   {...labelColorProps}
                    />

                    <CurrencyLabel labelText={"SPENDING"}
                                 satoshies={props.store.totalSpent}
                                 {...labelColorProps}
                    />
                    <CurrencyLabel labelText={"REVENUE"}
                                satoshies={props.store.totalRevenue}
                                {...labelColorProps}
                    />
                    { /**
                     <BandwidthLabel labelText={'DOWNLOAD SPEED'}
                     bytesPerSecond={props.store.totalDownloadSpeed}
                     {...labelColorProps}
                     />

                     <BandwidthLabel labelText={'UPLOAD SPEED'}
                     bytesPerSecond={props.store.totalUploadSpeed}
                     {...labelColorProps}
                     />
                     **/
                    }

                </LabelContainer>

            </MiddleSection>

            <TorrentTable torrents={props.store.torrentsCompleted} store={props.store} />

        </div>
    )
})

Completed.propTypes = {
    store : PropTypes.object.isRequired,
    middleSectionBaseColor : PropTypes.string.isRequired,
    middleSectionDarkBaseColor : PropTypes.string.isRequired,
    middleSectionHighlightColor : PropTypes.string.isRequired
}

export default Completed
