import React from 'react'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'

import {
    LabelContainer,
    MiddleSection,
    Toolbar,
    ToolbarButton,
    MaxFlexSpacer,
    TorrentCountLabel,
    CurrencyLabel,
    BandwidthLabel
} from './../../components/MiddleSection'

import TorrentTable from './TorrentTable'
import StartUploadingFlow from './components/StartUploadingFlow'

function getStyles (props) {
  return {
    root: {
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1
    }
  }
}

const Seeding = observer((props) => {
  let styles = getStyles(props)

  let labelColorProps = {
    backgroundColorRight: props.middleSectionHighlightColor,
    backgroundColorLeft: props.middleSectionDarkBaseColor
  }

  return (
    <div style={styles.root}>
      <MiddleSection backgroundColor={props.middleSectionBaseColor}>
        <Toolbar>
          <ToolbarButton title='Start uploading'
            onClick={() => { props.store.startTorrentUploadFlow() }} />
        </Toolbar>

        <MaxFlexSpacer />

        <LabelContainer>
          <TorrentCountLabel count={props.store.torrentsUploading.length}
            {...labelColorProps} />

          <CurrencyLabel labelText={'REVENUE'}
            satoshies={props.store.totalRevenue}
            {...labelColorProps} />

          <BandwidthLabel labelText={'UPLOAD SPEED'}
            bytesPerSecond={props.store.totalUploadSpeed}
            {...labelColorProps} />

        </LabelContainer>
      </MiddleSection>

      <TorrentTable torrents={props.store.torrentsUploading} store={props.store} />

      <StartUploadingFlow store={props.store} />

    </div>
  )
})

Seeding.propTypes = {
  store: PropTypes.object.isRequired,
  middleSectionBaseColor: PropTypes.string.isRequired,
  middleSectionDarkBaseColor: PropTypes.string.isRequired,
  middleSectionHighlightColor: PropTypes.string.isRequired
}

export default Seeding
