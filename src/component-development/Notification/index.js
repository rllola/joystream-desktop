import React, {Component} from 'react'
import {ScenarioContainer} from '../common'
import Notifications from '../../components/Notifications'
import FlatButton from 'material-ui/FlatButton'

import NotificationStore from '../../core/NotificationStore'

class NotificationScenarios extends Component {
  constructor () {
    super()

    this.notificationStore = new NotificationStore()
  }

  addNotification () {
    this.notificationStore.addInformationNotification('Everything is ok !')
    this.notificationStore.addWarningNotification('Be carefull !')
    this.notificationStore.addDangerousNotification('Something went terribly wrong !')
  }

  render () {
    return (
      <ScenarioContainer>
        <h1>Hello</h1>
        <FlatButton onClick={this.addNotification.bind(this)} label="Add Notification" />
        <Notifications notificationStore={this.notificationStore} />
      </ScenarioContainer>
    )
  }
}

export default NotificationScenarios
