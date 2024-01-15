import React from 'react';
import styled from 'styled-components';
import { withTheme } from '@material-ui/core/styles';

import Strings from './Strings.js';
import { ThemedBubble } from './../Theme';

import customize from './customize.svg';

const BrowserAPI = require('browser-api');

const CustomizeWrapper = styled.div`
  display: flex;
  background-color: transparent;
`;

const CustomizeButtonWrapper = styled.div`
  position: absolute;
  bottom: 9px;
  right: 16px;
  z-index: 100;
`;

// Displays a Customize button on the bottom right of the screen. When clicked,
// opens a panel with options for configuring the page.
export class Customize extends React.Component {
  showOrHideCustomizeMenu(wide) {
    BrowserAPI.theme.showOrHideCustomizeMenu();
  }

  render() {
    if (!BrowserAPI.platform.isDesktop() || !BrowserAPI.theme.hasThemeAPI()) {
      return null;
    }

    // When a background image is shown, the customize button will be narrow.
    const wide = this.props.theme.browser.background.imageUrl.length === 0;
    const transparent = !wide;

    return (
      <CustomizeWrapper data-testid="Customize">
        <CustomizeButtonWrapper>
          <ThemedBubble
            text={Strings.customize}
            title={Strings.customize_full}
            icon={customize}
            wide={wide}
            transparent={transparent}
            onClick={() => this.showOrHideCustomizeMenu(wide)}
          />
        </CustomizeButtonWrapper>
      </CustomizeWrapper>
    );
  }
}

export default withTheme(Customize);
