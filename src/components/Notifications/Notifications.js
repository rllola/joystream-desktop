import React from 'react'
import { NotificationStack } from 'react-notification'
import { observer } from 'mobx-react'

const Notifications = observer((props) => {
  return (
    <NotificationStack
      notifications={props.notificationStore.notificationsArray}
      onDismiss={(notification) => {
        console.log('Dismiss')
      }}
      activeBarStyleFactory={(index, style, notification) => {
        return Object.assign(
          {},
          style,
          { bottom: `${2 + index * 5}rem` }
        )
      }}
    />
  )
})

export default Notifications
