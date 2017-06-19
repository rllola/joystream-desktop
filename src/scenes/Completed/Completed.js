import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'

@inject('sessionStore')
@observer
class Completed extends Component {
  render () {
    return (
      <div style={{marginTop: '20px'}} className="col-10">
        <h3>Completed</h3>

      </div>
    )
  }
}

export default Completed
