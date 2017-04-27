import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'

import TorrentList from '../../components/TorrentList'
import AddTorrentForm from '../../components/AddTorrentForm'

@inject('sessionStore')
@observer
class Completed extends Component {
  render () {
    return (
      <div style={{marginTop: '20px'}} className="col-10">
        <h3>Completed</h3>
        <br />
        <AddTorrentForm onSubmit={this.props.sessionStore.handleAddTorrent} />
        <br />
        <br />
        <TorrentList torrents={this.props.sessionStore.torrentsCompleted} />
      </div>
    )
  }
}

export default Completed
