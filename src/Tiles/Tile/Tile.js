import React from 'react';

import ShortcutPanel from './ShortcutPanel';
import TileView from './TileView';
import { buildTouchIconUrl, buildFaviconUrl } from './../../Util';

const BrowserAPI = require('browser-api');

class Tile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shortcutPanelActive: false,
      editMenuViaLongPress: false,
    };

    this.tileLink = React.createRef();
    this.editMenuIcon = React.createRef();
    this.longPressId = -1;
  }

  componentDidMount() {
    this.setState({
      editMenuViaLongPress: BrowserAPI.platform.isMobile(),
    });
  }

  handleClick(e) {
    if (this.props.isAddShortcut) {
      this.showShortcutPanel(e);
      return;
    }

    // Only handle click events directly on the tile itself; do not handle
    // clicks for the tile edit button here.
    if (e.target !== this.tileLink.current) {
      return;
    }

    if (BrowserAPI.loadInternalUrl(this.props.url)) {
      e.preventDefault();
    }
  }

  onMouseEnter(e) {
    if (this.props.canEdit && !this.state.editMenuViaLongPress) {
      this.timer = setTimeout((x) => {
        let editMenuIcon = this.editMenuIcon.current;
        if (editMenuIcon) {
          editMenuIcon.style.opacity = 1;
        }
      }, 450);
    }
  }

  onMouseLeave(e) {
    if (this.props.canEdit && !this.state.editMenuViaLongPress) {
      if (this.timer) {
        clearTimeout(this.timer);
      }

      let editMenuIcon = this.editMenuIcon.current;
      if (editMenuIcon) {
        editMenuIcon.style.opacity = 0;
      }
    }
  }

  onContextMenu(e) {
    if (this.props.canEdit && this.state.editMenuViaLongPress) {
      this.showShortcutPanel(e);
    } else if (this.props.url !== null) {
      // Do not show a context menu for chrome:// URLs. The browser itself will
      // force e.g. "Open Link in New Tab" to redirect to about:blank#blocked.
      const url = new URL(this.props.url);
      if (url.protocol === 'chrome:' || url.protocol === 'rebel:') {
        e.preventDefault();
      }
    }
  }

  // The |onContextMenu| event only works on desktop. On mobile, we have to
  // set up a timer when a touch event starts and trigger |onContextMenu| after
  // some timeout. If the user lets go before the timer expires, handle the
  // event as a normal click.
  onTouchStart(e) {
    e.preventDefault();

    this.longPressId = setTimeout(() => {
      this.longPressId = -1;
      this.onContextMenu(e);
    }, 1000);
  }

  onTouchEnd(e) {
    if (this.longPressId !== -1) {
      clearTimeout(this.longPressId);
      this.longPressId = -1;

      this.handleClick(e);
    }
  }

  onTouchMove(e) {
    if (this.longPressId !== -1) {
      clearTimeout(this.longPressId);
      this.longPressId = -1;
    }
  }

  showShortcutPanel(e) {
    e.preventDefault();
    this.setState({ shortcutPanelActive: true });
  }

  closeShortcutPanel() {
    this.setState({ shortcutPanelActive: false });
  }

  render() {
    let icon = this.props.faviconUrl;

    if (this.props.url && !this.props.muiIcon) {
      if (icon === null || icon.length === 0) {
        icon = {
          touchIcon: buildTouchIconUrl(this.props.url),
          favIcon: buildFaviconUrl(this.props.url, true),
        };
      }
    }

    const tile = (
      <TileView
        href={this.props.url}
        handleClick={(e) => this.handleClick(e)}
        onMouseEnter={(e) => this.onMouseEnter(e)}
        onMouseLeave={(e) => this.onMouseLeave(e)}
        onContextMenu={(e) => this.onContextMenu(e)}
        onTouchStart={(e) => this.onTouchStart(e)}
        onTouchEnd={(e) => this.onTouchEnd(e)}
        onTouchMove={(e) => this.onTouchMove(e)}
        showEditMenuPanel={(e) => {
          if (!this.props.isAddShortcut) this.showShortcutPanel(e);
        }}
        muiIcon={this.props.muiIcon}
        editRef={this.editMenuIcon}
        linkRef={this.tileLink}
        title={this.props.title}
        src={icon}
        isAddShortcut={this.props.isAddShortcut}
      />
    );

    if (this.state.shortcutPanelActive) {
      return (
        <React.Fragment>
          <ShortcutPanel
            closeCallback={() => this.closeShortcutPanel()}
            name={this.props.isAddShortcut ? null : this.props.title}
            url={this.props.isAddShortcut ? null : this.props.url}
            isEdit={!this.props.isAddShortcut}
          />
          {tile}
        </React.Fragment>
      );
    }

    return tile;
  }
}

export default Tile;
