/**
 * Created by bedeho on 23/05/17.
 */

import React, { Component } from 'react'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'

import { Row } from '../../components/Table'
import { NameField,
         StatusField,
         BytesPerSecondField,
         BitcoinValueField,
         PeerCountField} from '../../components/RowFields'
import TorrentToolbar from './TorrentToolbar'
import AbsolutePositionChildren from '../../components/AbsolutePositionChildren/AbsolutePositionChildren'
import ToolbarVisibilityType from '../../utils/ToolbarVisibilityState'

@observer
class TorrentRow extends Component {

  /**
   * Local UI state
   * ==============
   * toolbarVisible {bool} - whether the toolbar for this row is currently visible
   */

  render (props) {
    return (
      // Duplicated element see completed TorrentRow
      <Row className={this.props.toolbarVisibilityStatus === ToolbarVisibilityType.OnHover ? 'row-managed-toolbar-visiblity' : ''}
        backgroundColor={this.props.backgroundColor}>

        <NameField name={this.props.torrent.name} />

        <StatusField paused={this.props.torrent.canStart} />

        <BytesPerSecondField bytes={this.props.torrent.uploadSpeed} />

        <BitcoinValueField satoshis={this.props.torrent.sellerPrice} />

        <BitcoinValueField satoshis={this.props.torrent.totalRevenue} />

        <PeerCountField count={this.props.torrent.numberOfBuyers} />

        { this.getRenderedToolbar() }

      </Row>
    )
  }

  getRenderedToolbar () {
    return (
      this.props.toolbarVisibilityStatus !== ToolbarVisibilityType.Hidden
      ? <AbsolutePositionChildren left={-250} top={3}>
        <TorrentToolbar {...this.props.toolbarProps} torrent={this.props.torrent} store={this.props.store} />
      </AbsolutePositionChildren>
      : null
    )
  }
}

TorrentRow.propTypes = {
  torrent: PropTypes.object.isRequired, // hould we here _require_ a TorrentStore?
  toolbarVisibilityStatus: PropTypes.oneOf(Object.values(ToolbarVisibilityType)).isRequired,
  toolbarProps: PropTypes.object, // later use shape?
  store: PropTypes.object.isRequired
}

export default TorrentRow
