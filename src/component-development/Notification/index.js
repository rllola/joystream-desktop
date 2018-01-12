import React, {Component} from 'react'
import {ScenarioContainer} from '../common'
import { Notification } from 'react-notification'

class NotificationScenarios extends Component {
  constructor () {
    super()

    this.state = {
      isActive: true
    }
  }

  handleClick () {
    this.setState({isActive: false})
  }

  render () {
    return (
      <ScenarioContainer>
        <h1>Hello</h1>
        <Notification
          isActive={this.state.isActive}
          title={'NICE'}
          message={'Lol'}
          action={'Close'}
          onClick={this.handleClick.bind(this)}
        />
      </ScenarioContainer>
    )
  }
}

export default NotificationScenarios
