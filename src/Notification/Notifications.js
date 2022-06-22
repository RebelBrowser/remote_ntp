// Define notifications to display to users in this file. Each notification must
// be a JSON object with the following properties:
//
//   name: string
//     The name of the notification (used internally only).
//   title: string OR function
//     The header text to display for a notification.
//   linkUrl: string OR function
//     URL for users to see more information about the notification.
//   linkText: string OR function
//     Text to display describing the URL.
//   severe: boolean OR function
//     Whether the notification is important/severe. Causes the page's theme
//     to change to a red background.
//   active: boolean OR function
//     Whether the notification is active and displayed.
//   dismissable: boolean OR function
//     Whether the notification is allowed to be dismissed.
//
// Each of the above properties may be the type indicated next to the property
// name OR may be a function. If defined as a function, a dictionary is passed
// into the function containing platform information about the browser; the
// function is expected to return the type indicated. See BrowserApi.platform
// for details.
//
// The notification will be displayed at the top of the page with the layout:
//
//        [Title Text]
//   [Link Text] [Body Text]
//
// Only one notification can be active at a time. To change the active
// notification, update the deault export at the bottom of this file. All other
// notifications should have a "eslint-disable-next-line" directive preceding
// the notification declaration to suppress unused variable warnings.

// Notification to display to the user when their browser version is out-of-date
// compared to the current stable version. The notification is displayed in
// severe mode if the user is more than 2 major versions out-of-date.
// eslint-disable-next-line
const OUT_OF_DATE_NOTIFICATION = {
  name: 'out-of-date',

  title: function (platform_info) {
    const header = this.severe(platform_info)
      ? 'Your browser is severely out of date!'
      : 'Your browser is out of date!';

    return header + ' Upgrade now for the latest security fixes and features.';
  },

  linkUrl: 'rebel://settings/help',
  linkText: 'Click here to update',

  severe: function (platform_info) {
    const [major_diff] = this._versionDifference(platform_info.version);
    return major_diff > 2;
  },

  active: function (platform_info) {
    if (!platform_info.isWindows() && !platform_info.isMacOS()) {
      // Only display the out-of-date notification on Windows and macOS right
      // now, since mobile and Linux are promoted separately.
      return false;
    }

    const [major_diff, patch_diff] = this._versionDifference(
      platform_info.version
    );

    return major_diff > 0 || (major_diff === 0 && patch_diff > 0);
  },

  dismissable: false,

  _versionDifference: function (version) {
    const STABLE_MAJOR = 91;
    const STABLE_PATCH = 30759;

    if (version === null) {
      return [0, 0];
    }

    version = version.split('.');
    const major = parseInt(version[0], 10);
    const patch = parseInt(version[3], 10);

    return [STABLE_MAJOR - major, STABLE_PATCH - patch];
  },
};

// Notification to inform iOS users that they may make Rebel Browser their
// default browser on iOS 14.
const IOS_DEFAULT_BROWSER_NOTIFICATION = {
  name: 'ios-default-browser-notification',
  title: 'You may now make Rebel Browser your default browser!',

  linkUrl: 'rebel://settings',
  linkText: 'Click here to make the change',

  active: function (platform_info) {
    const DEFAULT_ALLOWED_BROWSER_VERSION = 86;
    const DEFAULT_ALLOWED_IOS_VERSION = 14;

    if (platform_info.isIOS()) {
      // TODO it would be better if the BrowserAPI provided OS version. But at
      // least we have the source code which forms the User-Agent string.
      // See: //ios/web/common/user_agent.mm
      const matches = /OS (\d+)_(\d+)/.exec(window.navigator.userAgent);
      const ios_major = matches === null ? 0 : parseInt(matches[1], 10);

      if (ios_major >= DEFAULT_ALLOWED_IOS_VERSION) {
        const browser_version = platform_info.version.split('.');
        const browser_major = parseInt(browser_version[0], 10);

        return browser_major >= DEFAULT_ALLOWED_BROWSER_VERSION;
      }
    }

    return false;
  },

  severe: false,
  dismissable: true,
};

const NOTIFICATIONS = [
  IOS_DEFAULT_BROWSER_NOTIFICATION,
  OUT_OF_DATE_NOTIFICATION,
];

export default NOTIFICATIONS;
