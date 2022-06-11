import React from 'react';
import CustomizePanel from '../CustomizePanel.js';
import styled, { css } from 'styled-components';

import background_local from './background_local.svg';

// Styles for the wrapper of tiles in the background custom menu
export const BackgroundPanelStyles = css`
  background-color: ${(props) => props.theme.palette.background.ternary};

  width: 185px;
  height: 185px;

  position: relative;

  margin-top: 0;
  margin-bottom: ${(props) => (props.noTitle ? '8px' : '45px')};
  margin-inline-end: 8px;

  border-radius: 4px;

  // Remove the ending margin on the last background image panel in each row
  &:nth-of-type(3n) {
    margin-inline-end: 0;
  }
`;

export const UploadBackgroundIcon = styled.img.attrs((props) => ({
  src: background_local,
}))`
  // We have to keep this filer around since it works on the NTP SVG
  filter: var(--themed-secondary-filter);

  padding-top: 15px;
  margin-top: 25px;

  width: 100px;
  height: 100px;

  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position-x: center;
  -webkit-mask-position-y: center;
`;

// Styled for the tile in a background menu
export const BackgroundTileWrapper = css`
  width: 100%;
  height: 100%;

  outline: none;

  border-radius: 4px;
  cursor: pointer;
`;

export default function CustomizeBackgroundsView(props) {
  return <CustomizePanel {...props} />;
}
