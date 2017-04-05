import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'

import TorrentList from '../TorrentList/'
import AddTorrentForm from '../AddTorrentForm'

@inject('joystreamStore')
@observer
class Seeding extends Component {
  render () {
    return (
      <div style={{marginTop: '20px'}} className="col-10">
        <h3>Seeding</h3>
        <br />
        <AddTorrentForm />
        <br />
        <br />
        <TorrentList torrents={this.props.joystreamStore.torrents} />
      </div>
    )
  }
}

export default Seeding
