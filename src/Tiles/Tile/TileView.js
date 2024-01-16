import React from 'react';
import styled, { css } from 'styled-components';
import { Typography } from '@material-ui/core';
import {
  MoreVert,
  Add,
  SettingsApplicationsOutlined,
  History,
} from '@material-ui/icons';
import TileMediaVariables from './TileViewMedia';

import { ReactComponent as SpeedCheck } from './rocket.svg';
import { LoadImage } from './../../Util';

const TileContainer = styled.div`
  ${TileMediaVariables}
  height: var(--tile-height);
  width: var(--tile-width);
  margin-bottom: var(--tile-margin-bottom);

  border-radius: 4px;
  box-sizing: border-box;
  position: relative;
`;

const TileLink = styled.a`
  ${TileMediaVariables}
  padding: var(--tile-padding-top) 10px 10px 10px;

  display: block;

  color: inherit;
  text-decoration: none;
  -webkit-tap-highlight-color: transparent;

  cursor: pointer;
`;

const TileWrapper = styled.div`
  height: 100%;
  width: 100%;
  z-index: -2;

  display: flex;
  flex-flow: column nowrap;

  position: relative;
  align-items: center;
`;

const hoverCSS = css`
  border-color: ${(props) => props.theme.palette.primary.main};
  box-shadow: none;
`;

const TileIconWrapperStyles = css`
  height: var(--tile-icon-wrapper-size);
  width: var(--tile-icon-wrapper-size);
  margin-bottom: var(--tile-icon-margin-bottom);

  box-shadow: var(--themed-shadow);
  border-radius: var(--tile-icon-border-radius);

  background-color: ${(props) =>
    props.theme.browser.darkModeEnabled
      ? 'var(--tile-background-darkMode)'
      : 'var(--tile-background-lightMode)'};

  display: flex;
  pointer-events: none;
  justify-content: center;
  align-items: center;

  ${TileContainer}:hover & {
    border: 2px solid;
    ${hoverCSS}
  }

  @media (max-width: 500px) and (min-width: 300px) {
    ${TileContainer}:hover & {
      border: 1px solid;
      ${hoverCSS}
    }
  }
`;

const SmallIconWrapper = styled.div`
  ${TileIconWrapperStyles}
  ${TileIconWrapperStyles}
`;

const SmallTileIcon = styled.img`
  ${TileMediaVariables}
  height: var(--tile-icon-size-small);
  width: var(--tile-icon-size-small);

  @media (max-width: 500px) and (min-width: 300px) {
    height: 50px;
    width: 50px;
  }
`;

const LargeTileIcon = styled.img`
  ${TileMediaVariables}
  ${TileIconWrapperStyles}
`;

const TileMonogram = styled.div`
  ${TileMediaVariables}
  ${TileIconWrapperStyles}

  &:before {
    content: ${(props) => props.letter};
    font-size: 40px;
    font-weight: 600;
    box-sizing: inherit;
    width: inherit;
    height: inherit;
    border-radius: var(--tile-icon-border-radius);
    padding-top: 15px;
    color: ${(props) => props.theme.palette.primary.main};

    @media (max-width: 500px) and (min-width: 359px) {
      padding-top: 5px !important;
    }

    @media (max-width: 325px) {
      padding-top: 0px !important;
    }
  }
`;

const MuiIconWrapper = styled.div`
  ${TileIconWrapperStyles}

  ${(props) =>
    props.isAddIcon
      ? css`
          box-shadow: 0 0 0px 0px rgba(32, 33, 36, 0.28); // gets rid of the border
          background-color: ${(props) =>
            props.theme.browser.darkModeEnabled
              ? 'var(--tile-background-darkMode)'
              : 'var(--tile-addTile-background-lightMode)'};
        `
      : ''}
`;

const MuiIconStyle = css`
  fill: ${(props) => props.theme.palette.primary.main};
  width: 1.75em;
  height: 1.75em;
`;

const AddIcon = styled(Add)`
  ${MuiIconStyle}
  width: 1.5em;
  height: 1.5em;
`;

const SettingIcon = styled(SettingsApplicationsOutlined)`
  ${MuiIconStyle}
`;

const HistoryIcon = styled(History)`
  ${MuiIconStyle}
`;

const SpeedCheckIcon = styled(SpeedCheck)`
  ${MuiIconStyle};
  width: 2.5em;
  height: 2.5em;
`;

const TileTitleWrapper = styled.div`
  max-width: var(--tile-title-width);
  max-height: var(--tile-title-max-height);
  font-size: var(--tile-title-font-size);
  text-align: center;
  white-space: nowrap;
`;

const EditIcon = styled(MoreVert)`
  transform: rotate(0.25turn);
  background-color: var(--color-teal);
  border-radius: 50%;
  border: none;
  cursor: pointer;
  height: 20px;
  width: 20px;
  opacity: 0;
  color: white;
  position: absolute;
  right: 11px;
  top: 11px;

  @media (max-width: 500px) {
    right: -2px;
    top: 6px;
  }
`;

export default class TileView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      icon: this.getIconForURL(null),
    };
  }

  getIconForURL(url) {
    if (this.props.muiIcon) {
      let icon = null;

      switch (this.props.muiIcon) {
        case 'settings':
          icon = <SettingIcon />;
          break;
        case 'history':
          icon = <HistoryIcon />;
          break;
        case 'speedcheck':
          icon = <SpeedCheckIcon />;
          break;
        case 'add':
          icon = <AddIcon />;
          break;
        default:
          break;
      }

      if (icon !== null) {
        return (
          <MuiIconWrapper isAddIcon={this.props.isAddShortcut}>
            {icon}
          </MuiIconWrapper>
        );
      }
    }

    if (url !== null && url.length !== 0)
      if (url.includes('remote-ntp-offline/icon')) {
        return <LargeTileIcon src={url} alt={this.props.title} />;
      } else {
        return (
          <SmallIconWrapper>
            <SmallTileIcon src={url} alt={this.props.title} />
          </SmallIconWrapper>
        );
      }

    // Fallback to a monogram letter of the tile title.
    const letter = this.props.title.substr(0, 1).toUpperCase();
    return <TileMonogram letter={`'${letter}'`} />;
  }

  componentDidMount() {
    if (this.props.src === null) {
      return;
    }

    LoadImage(
      this.props.src.touchIcon ? this.props.src.touchIcon : this.props.src,

      // If the browser responded with a touch icon, use it.
      (url) => this.setState({ icon: this.getIconForURL(url) }),

      // Otherwise, fallback to using the favicon, or a monogram.
      () => {
        LoadImage(
          this.props.src.favIcon ? this.props.src.favIcon : this.props.src,
          (url) => this.setState({ icon: this.getIconForURL(url) })
        );
      }
    );
  }

  render = () => (
    <TileContainer data-testid={!this.props.isAddShortcut ? 'Tile' : 'addTile'}>
      <TileLink
        href={this.props.href}
        onClick={(e) => this.props.handleClick(e)}
        onMouseEnter={(e) => this.props.onMouseEnter(e)}
        onMouseLeave={(e) => this.props.onMouseLeave(e)}
        onContextMenu={(e) => this.props.onContextMenu(e)}
        onTouchStart={(e) => this.props.onTouchStart(e)}
        onTouchEnd={(e) => this.props.onTouchEnd(e)}
        onTouchMove={(e) => this.props.onTouchMove(e)}
        ref={this.props.linkRef}
      >
        <TileWrapper>
          {this.state.icon}
          <TileTitleWrapper>
            <Typography noWrap variant="body1">
              {this.props.title}
            </Typography>
          </TileTitleWrapper>
        </TileWrapper>
        <EditIcon
          onClick={(e) => this.props.showEditMenuPanel(e)}
          ref={this.props.editRef}
        />
      </TileLink>
    </TileContainer>
  );
}
