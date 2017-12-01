import React from 'react'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'

import TorrentTable from './TorrentTable'
import StartDownloadingFlow from './components/StartDownloadingFlow'

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

function getStyles (props) {
  return {
    root: {
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1
    }
  }
}

const Downloading = observer((props) => {
  let styles = getStyles(props)

  let labelColorProps = {
    backgroundColorLeft: props.middleSectionDarkBaseColor,
    backgroundColorRight: props.middleSectionHighlightColor
  }

  return (
    <div style={styles.root}>
      <MiddleSection backgroundColor={props.middleSectionBaseColor}>

        <Toolbar>
          <ToolbarButton
            title='Start downloading'
            onClick={props.onStartDownloadClicked} />
        </Toolbar>

        <MaxFlexSpacer />

        <LabelContainer>
          <TorrentCountLabel
            count={props.torrents.length}
            {...labelColorProps} />

          <CurrencyLabel
            labelText={'SPENDING'}
            satoshies={props.spending}
            {...labelColorProps} />

          <BandwidthLabel
            labelText={'DOWNLOAD SPEED'}
            bytesPerSecond={props.downloadSpeed}
            {...labelColorProps} />
        </LabelContainer>
      </MiddleSection>

      <TorrentTable
        torrents={props.torrents}
        store={props.store}
        onStartDownloadDrop={props.onStartDownloadDrop} />

      <StartDownloadingFlow store={props.store} />
    </div>
  )
})

Downloading.propTypes = {
  torrents: PropTypes.any.isRequired,
  spending: PropTypes.number.isRequired,
  downloadSpeed: PropTypes.number.isRequired,
  onStartDownloadClicked: PropTypes.func.isRequired,
  onStartDownloadDrop: PropTypes.func.isRequired,
  torrentsBeingLoaded: PropTypes.array.isRequired,

  middleSectionBaseColor: PropTypes.string.isRequired,
  middleSectionDarkBaseColor: PropTypes.string.isRequired,
  middleSectionHighlightColor: PropTypes.string.isRequired
}

export default Downloading
