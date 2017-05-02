import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'

import SeedingTorrentList from './components/SeedingTorrentList/'
import AddTorrentForm from '../../components/AddTorrentForm'

@inject('sessionStore')
@observer
class Seeding extends Component {
  render () {
    return (
      <div style={{marginTop: '20px'}} className="col-10">
        <h3>Seeding</h3>
        <br />
        <AddTorrentForm onSubmit={this.props.sessionStore.handleAddTorrent} />
        <br />
        <br />
        <SeedingTorrentList torrents={this.props.sessionStore.torrentsSeeding} />
      </div>
    )
  }
}

export default Seeding
