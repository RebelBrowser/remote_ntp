import React from 'react';
import { StylesProvider, createTheme } from '@material-ui/core/styles';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import { ThemeProvider } from 'styled-components';

import './Theme.css';
import { default as LightTheme } from './Themes/LightTheme';
import { default as DarkTheme } from './Themes/DarkTheme';
import { rgbaToString } from './../Util';

const BrowserAPI = require('browser-api');

// This is the main theme color and is applied in places where we want to get it
// We keep this for legacy reason please use MUI Theming
const CONTOUR_CSS_PROPERTY = '--themed-contour-color';

export const ThemeContext = React.createContext();

class BrowserThemeProvider extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      darkModeEnabled: false, // if dark mode load the dark mode theming
      background: BrowserAPI.theme.getDefaultBackground(),
      colors: BrowserAPI.theme.getDefaultColors(),
    };
  }

  componentDidMount() {
    BrowserAPI.theme.addThemeObserver((theme) => this.onThemeChanged(theme));
  }

  onThemeChanged(theme) {
    this.setState(theme);
  }

  render() {
    // Abstract all of this out into the new theme engine
    document.body.style.removeProperty(CONTOUR_CSS_PROPERTY);

    let theme = null;
    if (this.state.darkModeEnabled) {
      theme = DarkTheme;
      theme.inverted = LightTheme;
    } else {
      theme = LightTheme;
      theme.inverted = DarkTheme;
    }

    // Setting and resetting theme primary Color and theme objs that use primary
    if (this.state.colors.colorId !== -1) {
      const primaryColor = rgbaToString(this.state.colors.color);

      theme.palette.primary.main = primaryColor;
      theme.typography.h1.color = primaryColor;
      theme.typography.h3.color = primaryColor;
      if (!this.state.darkModeEnabled) theme.typography.h1.color = primaryColor;
    } else {
      const teal = '#0aa5ab';

      // reset theme
      theme.palette.primary.main = teal;
      theme.typography.h1.color = teal;
      theme.typography.h3.color = teal;
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
    }
    // Remove Background and reset theme
    else {
      theme.browser.background = {
        collectionId: '',
        imageUrl: '',
        imageAlignment: '',
        imageTiling: '',
        attributionLine1: '',
        attributionLine2: '',
        attributionUrl: '',
        attributionImageUrl: '',
        thumbnailUrl: '',
      };

      // reset theme
      if (this.state.darkModeEnabled) {
        theme.typography.body1.color = '#ffffff';
        theme.typography.h2.color = '#ffffff';
      } else {
        theme.typography.body1.color = '#465967';
        theme.typography.h2.color = '#465967';
      }
    }

    // Add Browser Colors to new theme
    theme.browser.colors = this.state.colors;

    // Legacy Code for components that still use css values for theming colors
    if (this.state.colors.colorId !== -1) {
      document.body.style.setProperty(
        CONTOUR_CSS_PROPERTY,
        rgbaToString(this.state.colors.colorDark)
      );
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
