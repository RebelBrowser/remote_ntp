import React from 'react';
import styled, { css } from 'styled-components';
import { Colorize } from '@material-ui/icons';

import CustomizePanel from '../CustomizePanel.js';
import { isDarkColor, rgbaFromHex, rgbaToString } from './../../Util';

import default_theme_dark from './default_theme_dark.svg';
import default_theme_light from './default_theme_light.svg';

export const ColorPanelStyles = css`
  width: 64px;
  height: 64px;

  position: relative;

  margin-top: 2px;
  margin-bottom: 25px;
  margin-inline-start: 10px;
  margin-inline-end: 25px;

  border-radius: 50%;
  box-shadow: ${(props) => props.theme.shadows[3]};
`;

export const ColorDefaultIcon = styled.img.attrs((props) => ({
  src: props.theme.browser.darkModeEnabled
    ? default_theme_dark
    : default_theme_light,
}))``;

const ColorCustomWrapper = styled.div`
  background-image: linear-gradient(
    to right,
    ${(props) => rgbaToString(props.secondaryColor)},
    ${(props) => rgbaToString(props.secondaryColor)} 50%,
    ${(props) => rgbaToString(props.primaryColor)} 50%
  );

  display: flex;
  justify-content: center;
  align-items: center;

  border: 1px solid ${(props) => props.theme.palette.primary.main};
  border-radius: 50%;
  width: 64px;
  height: 64px;
  cursor: pointer;
`;

const ColorCustomIcon = styled(Colorize)`
  fill: ${(props) => (props.$useWhiteIcon ? 'white' : 'black')};

  width: 64px;
  height: 64px;

  padding: 21px;
`;

export function CustomColor(onClick, theme) {
  let primaryColor = rgbaFromHex(theme.palette.primary.main);
  let secondaryColor = rgbaFromHex(theme.palette.background.main);
  let useWhiteIcon = theme.browser.darkModeEnabled;

  if (theme.browser.colors.colorId !== -1) {
    primaryColor = theme.browser.colors.colorDark;
    secondaryColor = theme.browser.colors.colorLight;

    useWhiteIcon = isDarkColor(primaryColor) || isDarkColor(secondaryColor);
  }

  // N.B. the $ on the |useWhiteIcon| property is to indicate that it is a
  // transient property (i.e. should not be included in the DOM). In this case,
  // styled-components seems to throw an error if the property is non-transient.
  // https://styled-components.com/docs/api#transient-props
  return (
    <React.Fragment>
      <ColorCustomWrapper
        onClick={(e) => onClick(e)}
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
      >
        <ColorCustomIcon $useWhiteIcon={useWhiteIcon} />
      </ColorCustomWrapper>
    </React.Fragment>
  );
}

export const CustomColorPicker = styled.input.attrs((props) => ({
  type: 'color',
}))`
  display: none;

  &:active {
    box-shadow: 0 0 0 2px ${(props) => props.theme.palette.highlight.main};
  }
`;

export const ColorTileWrapper = css`
  width: 100%;
  height: 100%;

  outline: none;

  border-radius: 4px;
  cursor: pointer;
`;

export default function CustomizeColorsView(props) {
  return <CustomizePanel {...props} />;
}
