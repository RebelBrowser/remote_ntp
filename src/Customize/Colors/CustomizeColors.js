import React from 'react';
import { withTheme } from '@material-ui/core/styles';

import Strings from '../Strings.js';
import CustomizeColorsView, { CustomColorPicker } from './CustomizeColorsView';

import custom_color from './custom_color.svg';

const BrowserAPI = require('browser-api');

// Panel to allow the user to the browser window's color scheme. The available
// colors are retrieved from the browser.
export class CustomizeColors extends React.Component {
  constructor(props) {
    super(props);

    this.picker = React.createRef();

    this.state = {
      selectedColor: null,
      colors: [],
    };
  }

  componentDidMount() {
    const colors = BrowserAPI.theme.getAvailableColors();
    if (colors.length === 0) {
      return;
    }

    // Insert the custom color picker at the beginning.
    colors.unshift({
      colorId: 0,
      label: Strings.colors.custom,
      icon: custom_color,
    });

    this.setState({ colors: colors });
  }

  selectColor(color, themeColors) {
    if (color !== null && color.colorId === 0) {
      this.selectCustomColor(color, themeColors);
    } else {
      BrowserAPI.theme.previewColor(color);
    }

    this.setState({
      selectedColor: color,
    });
  }

  selectCustomColor(color, themeColors) {
    // Only parse the RGB values. Color inputs do not accept alpha values.
    const hexStrings = themeColors.color.splice(0, 3).map((c) => {
      c = parseInt(c).toString(16);
      return c.length === 1 ? '0' + c : c;
    });

    this.picker.current.focus();
    this.picker.current.value = '#' + hexStrings.join('');
    this.picker.current.click();
  }

  onCustomColorChange(e) {
    const hex = e.currentTarget.value;

    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);

    BrowserAPI.theme.previewColor({
      colorId: 0,
      color: [r, g, b, 255],
    });
  }

  render() {
    const browserColors = this.props.theme.browser.colors;

    let selectedColor = this.state.selectedColor;
    if (selectedColor === null && browserColors.colorId !== -1) {
      selectedColor = this.state.colors[browserColors.colorId];
    }

    return (
      <React.Fragment>
        <CustomizeColorsView
          //
          defaultTitle={Strings.colors.default}
          defaultIconId="customize-menu-default-colors-icon"
          defaultSelected={() => this.selectColor(null, browserColors)}
          type="color"
          //
          options={this.state.colors}
          optionId={(o) =>
            o.colorId === 0 ? 'customize-menu-custom-color' : null
          }
          optionIcon={(o) => o.icon}
          optionIconId={(o) =>
            o.colorId === 0 ? 'customize-menu-custom-color-icon' : null
          }
          optionLabel={(o) => o.label}
          optionSelected={(color) => this.selectColor(color, browserColors)}
          //
          smallSelectionIcon={true}
          selectedOption={selectedColor}
        />

        <CustomColorPicker
          type="color"
          ref={this.picker}
          onChange={(e) => this.onCustomColorChange(e)}
        />
      </React.Fragment>
    );
  }
}

export default withTheme(CustomizeColors);
