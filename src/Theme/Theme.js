import React from 'react';
import { StylesProvider, createTheme } from '@material-ui/core/styles';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import { ThemeProvider } from 'styled-components';

import './Theme.css';
import { default as LightTheme } from './Themes/LightTheme';
import { default as DarkTheme } from './Themes/DarkTheme';

const BrowserAPI = require('browser-api');

export const ThemeContext = React.createContext();

class BrowserThemeProvider extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      darkModeEnabled: false, // if dark mode load the dark mode theming
      background: BrowserAPI.theme.getDefaultBackground(),
    };
  }

  componentDidMount() {
    BrowserAPI.theme.addThemeObserver((theme) => this.onThemeChanged(theme));
  }

  onThemeChanged(theme) {
    this.setState(theme);
  }

  render() {
    let theme = null;

    if (this.state.darkModeEnabled) {
      theme = DarkTheme;
      theme.inverted = LightTheme;
    } else {
      theme = LightTheme;
      theme.inverted = DarkTheme;
    }

    // This is where we do the dark more light mode switch
    document.body.className = this.state.darkModeEnabled
      ? 'theme-dark'
      : 'theme-light';

    // Add a background to the document
    if (this.state.background.imageUrl.length !== 0) {
      theme.browser.background = this.state.background;

      // Makes tiles, toggle title, and footer white when we have a background
      theme.typography.body1.color = '#ffffff';
      theme.typography.h2.color = '#ffffff';
    } else {
      theme.browser.background = BrowserAPI.theme.getDefaultBackground();
    }

    const muiTheme = createTheme(theme);

    return (
      <StylesProvider injectFirst>
        <MuiThemeProvider theme={muiTheme}>
          <ThemeProvider theme={muiTheme}>{this.props.children}</ThemeProvider>
        </MuiThemeProvider>
      </StylesProvider>
    );
  }
}

export default BrowserThemeProvider;
