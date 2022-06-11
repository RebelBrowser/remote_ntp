import React from 'react';
import styled from 'styled-components';
import { withTheme } from '@material-ui/core';

import logo_dark from './logo_dark.svg';
import logo_light from './logo_light.svg';

const BrowserLogo = styled.img`
  margin-top: 9vh;
  margin-bottom: 10px;

  @media (max-width: 500px) {
    height: 50px;
  }

  @media (min-width: 500px) {
    height: 70px;
  }
`;

export class Logo extends React.Component {
  selectLogo() {
    const hasBackground =
      this.props.theme.browser.background.imageUrl.length !== 0;
    const isDarkMode = this.props.theme.browser.darkModeEnabled;

    if (hasBackground || isDarkMode) {
      return logo_dark;
    }

    return logo_light;
  }
  render = () => {
    const logo = this.selectLogo();
    return (
      <header>
        <BrowserLogo
          className="logo"
          alt="logo"
          data-testid="Logo-image"
          src={logo}
        />
      </header>
    );
  };
}

export default withTheme(Logo);
