import React from 'react';
import { withTheme } from '@material-ui/core';

import Notifications from './Notifications';
import NotificationView from './NotificationView';
import { ThemedButton, ThemedButtonGroup } from '../Theme';

const BrowserAPI = require('browser-api');

const DISMISSED_NOTIFICATIONS = 'dismissed_notifications';
const DISMISSED_NOTIFICATION_SEPARATOR = '::';

export class Notification extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      active: false,
      name: '',
      title: '',
      linkUrl: '',
      linkText: '',
      text: '',
      severe: false,
      dismissable: false,
    };
  }

  componentDidMount() {
    const url = new URL(window.location.href);

    // Do not show notifications on the offline RemoteNTP because we cannot
    // update their active state remotely.
    if (url.protocol !== 'chrome-search:') {
      this.setStateForActiveNotification();
    }
  }

  setStateForActiveNotification() {
    const get_key = (notification, key) =>
      typeof notification[key] === 'function'
        ? notification[key](BrowserAPI.platform)
        : notification[key];

    const dismissed = localStorage.getItem(DISMISSED_NOTIFICATIONS) || '';

    // Filter out inactive and dismissed notifications.
    const active = Notifications.filter(
      (n) => get_key(n, 'active') && dismissed.indexOf(n.name) === -1
    );

    if (active.length === 0) {
      this.setState({ active: false });
      return;
    }

    // If we have active, non-dismissed notifications, render the first one.
    let state = {};
    for (const key in this.state) {
      state[key] = get_key(active[0], key);
    }

    this.setState(state);
  }

  handleDismissClick() {
    let dismissed = localStorage.getItem(DISMISSED_NOTIFICATIONS);

    if (dismissed !== null && dismissed.length > 0) {
      dismissed += DISMISSED_NOTIFICATION_SEPARATOR + this.state.name;
    } else {
      dismissed = this.state.name;
    }

    localStorage.setItem(DISMISSED_NOTIFICATIONS, dismissed);
    this.setStateForActiveNotification();
  }

  handleNavClick() {
    if (!BrowserAPI.loadInternalUrl(this.state.linkUrl)) {
      window.location.href = this.state.linkUrl;
    }
  }

  render() {
    if (!this.state.active) {
      return null;
    }

    const dismiss = this.state.dismissable ? (
      <ThemedButton
        id="notification-dismiss"
        text={'Dismiss'}
        type="button"
        primary={true}
        variant={'outlined'}
        onClick={() => this.handleDismissClick()}
      />
    ) : null;

    const buttons = (
      <ThemedButtonGroup align="center">
        {dismiss}
        <ThemedButton
          id="notification-action"
          text={this.state.linkText}
          type="button"
          primary={true}
          onClick={() => this.handleNavClick()}
        />
      </ThemedButtonGroup>
    );

    return (
      <NotificationView
        title={this.state.title}
        severe={this.state.severe}
        buttons={buttons}
      />
    );
  }
}

export default withTheme(Notification);
