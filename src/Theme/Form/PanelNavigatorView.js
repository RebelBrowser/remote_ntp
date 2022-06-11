import React from 'react';
import styled, { css } from 'styled-components';
import { Wallpaper, ColorLens } from '@material-ui/icons';

const PanelButton = styled.button`
  background-color: ${(props) =>
    props.active ? props.theme.palette.primary.main : 'inherit'};

  width: inherit;
  height: 34px;

  left: 0;

  margin-bottom: 16px;

  font-size: 14px;
  text-align: start;

  border-radius: 0 16px 16px 0;
  outline: none;
  border: none;

  cursor: pointer;

  &:hover {
    background-color: ${(props) => props.theme.palette.primary.main};
  }
`;

const IconWrapper = styled.div`
  display: inline-block;

  width: 20px;
  height: 32px;

  margin-inline-start: 8px;
`;

const LabelWrapper = styled.div`
  display: inline-block;
  color: ${(props) =>
    props.active ? 'white' : props.theme.palette.primary.main};

  max-width: 125px;
  height: 32px;

  line-height: 32px;

  margin-inline-start: 16px;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  user-select: none;

  ${PanelButton}:hover & {
    color: white;
  }
`;

const BaseIcon = css`
  height: 20px;
  width: 20px;
  background-size: 20px 20px;
  margin-bottom: 6px;

  fill: ${(props) =>
    props.active ? 'white' : props.theme.palette.primary.main};

  -webkit-mask-size: 20px;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position-x: center;
  -webkit-mask-position-y: center;

  ${PanelButton}:hover & {
    fill: white;
  }
`;

// Decompose the props then pass theme back in to avoid passing directly to DOM
export const WallpaperIcon = styled(({ active, ...otherProps }) => (
  <Wallpaper {...otherProps} />
))`
  ${BaseIcon}
`;

export const ColorIcon = styled(({ active, ...otherProps }) => (
  <ColorLens {...otherProps} />
))`
  ${BaseIcon}
`;

export default function PanelNavigatorView(props) {
  const selectIcon = (icon, active) => {
    if (icon === 'wallpaper') {
      return <WallpaperIcon active={active ? true : false} />;
    } else if (icon === 'color') {
      return <ColorIcon active={active ? true : false} />;
    }

    return null;
  };

  const icon = selectIcon(props.icon, props.active);

  return (
    <PanelButton
      active={props.active}
      title="backgroundsOption"
      role="tab"
      aria-label={props.text}
      tabIndex="0"
      onClick={(e) => props.onClick(e)}
    >
      <IconWrapper>{icon}</IconWrapper>
      <LabelWrapper active={props.active}>{props.text}</LabelWrapper>
    </PanelButton>
  );
}
