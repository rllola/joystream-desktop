import { observable, action, computed } from 'mobx'

class NotificationStore {
  @observable notifications
  constructor () {
    this.notifications = []

    // Uncomment to see test
    // this.addNotification({title: 'Test', action: 'Close' })
  }

  addNotification (opts) {
    var notification = {
      title: opts.title || '',
      message: opts.message || '',
      dismissAfter: 10000, // 10 seconds
      key: Math.floor((Math.random() * 1000) + 1), // random nonce
      action: opts.action,
      onClick: (notification) => {
        // If action triggered default behavior is to remove notification
        this.deleteNotification(notification)
        if (typeof opts.onClick === 'function') {
          // Some more actions (change scene, open modal, alerts,...)
          opts.onClick()
        }
      }
    }
    this.pushNotification(notification)
  }

  @computed
  get notificationsArray () {
    // Needed when passed to an external library which verify typeof ==== 'Array'
    return this.notifications.slice()
  }

  @action
  pushNotification (notification) {
    this.notifications.push(notification)
  }

  @action
  deleteNotification (notification) {
    this.notifications = this.notifications.filter(function (el) { return el.key !== notification.key })
  }
}

export default NotificationStore
