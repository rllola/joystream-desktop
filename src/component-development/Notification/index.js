import React, {Component} from 'react'
import {ScenarioContainer} from '../common'
import { NotificationStack } from 'react-notification'
import FlatButton from 'material-ui/FlatButton'

class NotificationScenarios extends Component {
  constructor () {
    super()

    this.state = {
      notifications: []
    }
  }

  addNotification () {
    var notification = {
      message: 'Adding torrents',
      dismissAfter: 20000,
      key: Math.floor((Math.random() * 100) + 1),
      action: 'Close',
      onClick: (notification) => {
        this.setState({
          notifications: this.state.notifications.filter(function (el) { return el.key !== notification.key })
        })
      }
    }
    this.state.notifications.push(notification)
    this.setState({notifications: this.state.notifications})
  }

  render () {
    return (
      <ScenarioContainer>
        <h1>Hello</h1>
        <FlatButton onClick={this.addNotification.bind(this)} label="Add Notification" />
        <NotificationStack
          notifications={this.state.notifications}
          onDismiss={ (notification) => {
            this.setState({
              notifications: this.state.notifications.filter(function(el) { return el.key !== notification.key })
            })
          }}
        />
      </ScenarioContainer>
    )
  }
}

export default NotificationScenarios
