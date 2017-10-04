/**
 * Created by bedeho on 05/05/17.
 */

import React, { Component } from 'react'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'

import Table from '../../components/Table'
import TorrentRow from './TorrentRow'
import TorrentToolbar from './TorrentToolbar'
import TorrentContextMenu from './TorrentContextMenu'
import ToolbarVisibilityType from '../../utils/ToolbarVisibilityState'
import StartSeedingHint from './components/StartSeedingHint'
import AbsolutePositionChildren from '../../components/AbsolutePositionChildren/AbsolutePositionChildren'
import Dropzone from 'react-dropzone'

import { contextMenuHiddenState, contextMenuVisibleState, contextMenuRect } from '../../utils/ContextMenuHelper'

//@observer // this.props.torrents
class TorrentsTable extends Component {

    /**
     * Local UI state
     * ==============
     * contextMenu {
     *  top/left {Number} top location, w.r.t. its parent, for where context menu should be rendered
     *  torrent {} torrent to which context menu corresponds
     * }
     */

    constructor(props) {
        super(props)

        // Start out with hidden context menu
        this.state = contextMenuHiddenState()
    }

    hideContextMenu() {

        // Schedule updating state to have: hidden context menu
        this.setState(contextMenuHiddenState())
    }

    isContextMenuVisible() {
        return this.state.contextMenu !== null
    }

    toolbarMoreButtonClicked(e, torrent) {

        // If context menu is already visible, then hide
        if(this.isContextMenuVisible()) {
            this.hideContextMenu()
        } else {

            // If its not visible, we must show it, which also
            // requires that we provides intelligent positioning, which
            // is sensitive to the location of the toolbar w.r.t. the table,
            // and the table dimensions


            /// SOMETHING MORE ROBUST HERE, THIS TECHQNIUE WILL BREAK IF ANYTHING CHANGES
            /// WE NEED TO FIND DOM NODES USING COMPONENT PONTERS OR SOMETHING

            // DOM Node rectangle for more button w.r.t. view port
            var moreButtonRect = e.target.getBoundingClientRect()

            // Find DOM Node for table within which context menu should be positioned
            var tableContentRect = e.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.getBoundingClientRect()

            // Compute rect for context menu
            var rect = contextMenuRect(moreButtonRect, tableContentRect)

            // Update state to render new context menu visiblity
            this.setState(contextMenuVisibleState(rect.top, rect.left, torrent))
        }
    }

    render() {

        var dropZoneStyle = {
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            borderStyle:'none'
        }

        return (
            <Dropzone disableClick style={dropZoneStyle} onDrop={(files) => { this.props.store.startTorrentUploadFlowWithTorrentFile(files) }}>
                <Table column_titles={["", "State", "Speed", "Price", "Revenue", "Buyers", "Sellers"]}>
                    { this.getRenderedContextMenu() }
                    { this.getRenderedTorrentRows() }
                </Table>
            </Dropzone>
        )
    }

    getRenderedContextMenu() {

        return (
            this.isContextMenuVisible()
            ?
            <AbsolutePositionChildren left={this.state.contextMenu.left}
                                      top={this.state.contextMenu.top}
                                      zIndex={1}>
                <TorrentContextMenu onOutsideContextMenuClicked = {() => { this.hideContextMenu()}}
                                    paused = {this.state.contextMenu.torrent.paused}
                                    onChangePauseStatus = {() => {this.state.contextMenu.torrent.changePauseStatus(); this.hideContextMenu()}}
                                    changePriceEnabled = {this.state.contextMenu.torrent.canChangePrice}
                                    onChangePriceClicked = {() => {this.state.contextMenu.torrent.showChangePriceDialog(); this.hideContextMenu()}}
                                    onRemoveClicked = {() => {this.state.contextMenu.torrent.remove(); this.hideContextMenu()}}
                                    onRemoveAndDeleteDataClicked = {() => {this.state.contextMenu.torrent.removeAndDeleteData(); this.hideContextMenu()}}
                                    numberOfBuyers = {this.state.contextMenu.torrent.numberOfBuyers}
                                    numberOfSellers = {this.state.contextMenu.torrent.numberOfSellers}
                                    numberOfObservers = {this.state.contextMenu.torrent.numberOfObservers}
                                    numberOfNormalPeers = {this.state.contextMenu.torrent.numberOfNormalPeers}/>
            </AbsolutePositionChildren>
            :
            null
        )
    }

    getRenderedTorrentRows() {

        return (
            this.props.torrents.length == 0
            ?
            <StartSeedingHint key={0}/>
            :
            this.props.torrents.map((t) => { return this.getRenderedTorrentRow(t) })
        )
    }

    getRenderedTorrentRow(t) {

        var toolbarProps = {
            onOpenFolderClicked : () => { t.openFolder() },
            onMoreClicked : (e) => { this.toolbarMoreButtonClicked(e, t) }
        }

        return (
            <TorrentRow key={t.infoHash}
                        torrent={t}
                        toolbarVisibilityStatus = {this.getToolbarVisibilityTypeForTorrent(t)}
                        toolbarProps={toolbarProps}
                        store={this.props.store} />
        )
    }

    getToolbarVisibilityTypeForTorrent(t) {

        if(this.isContextMenuVisible()) {

            if(t == this.state.contextMenu.torrent)
                return ToolbarVisibilityType.Visible
            else
                return ToolbarVisibilityType.Hidden

        } else
            return ToolbarVisibilityType.OnHover

    }
}

TorrentsTable.propTypes = {
    torrents : PropTypes.array.isRequired, // Further refine this to require particular object (shapes) in array?
    store : PropTypes.object.isRequired
}

export default TorrentsTable
