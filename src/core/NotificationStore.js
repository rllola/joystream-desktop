import React from 'react'
import { observable, action, computed } from 'mobx'

class NotificationStore {
  @observable notifications
  constructor () {
    this.notifications = []
    this.counter = 0
  }

  _addNotification (opts) {
    var notification = {
      title: opts.title || '',
      message: opts.message || '',
      dismissAfter: 10000, // 10 seconds
      key: this.counter, // random nonce
      actionStyle: opts.actionStyle,
      titleStyle: { display: 'block' },
      action: opts.action,
      onClick: (notification) => {
        // If action triggered default behavior is to remove notification
        if (typeof opts.onClick === 'function') {
          // Some more actions (change scene, open modal, alerts,...)
          opts.onClick()
        }
        this.deleteNotification(notification)
      }
    }
    this.pushNotification(notification)
    this.counter += 1
  }

  addInformationNotification (message) {
    var opts = {
      title: 'Information',
      message: message,
      action: 'Close',
      actionStyle: { color: '#5bc0de' }
    }
    this._addNotification(opts)
  }

  addWarningNotification(message) {
    var opts = {
      title: 'Warning',
      message: message,
      action: 'Close',
      actionStyle: { color: '#ffa500' }
    }
    this._addNotification(opts)
  }

  addDangerousNotification(message) {
    var opts = {
      title: 'Alert',
      message: message,
      action: 'Close',
      actionStyle: { color: '#d9534f' }
    }
    this._addNotification(opts)
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
    console.log(notification)
    this.notifications = this.notifications.filter(function (el) { return el.key !== notification.key })
  }
}

export default NotificationStore
