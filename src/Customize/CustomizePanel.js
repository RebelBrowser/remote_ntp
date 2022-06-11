import React from 'react';

import styled from 'styled-components';
import { Typography } from '@material-ui/core';
import { withTheme } from '@material-ui/core/styles';

import SelectedOption from './SelectedOption';
import { LoadImage } from './../Util';

import {
  BackgroundPanelStyles,
  BackgroundTileWrapper,
  UploadBackgroundIcon,
} from './Backgrounds/CustomizeBackgroundsView';

import {
  ColorPanelStyles,
  ColorDefaultIcon,
  ColorTileWrapper,
  CustomColor,
} from './Colors/CustomizeColorsView';

const MenuPanel = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;

  width: 100%;
  max-width: 605px;
  max-height: 384px;

  margin-bottom: 10px;
  margin-top: 10px;
  padding-inline-end: 10px;

  overflow-y: auto;
`;

const ImagePanelTileWrapper = styled.div`
  ${(props) =>
    props.type === 'background' ? BackgroundPanelStyles : ColorPanelStyles}
`;

const ImagePanelTile = styled.div`
  ${(props) =>
    props.type === 'background' ? BackgroundTileWrapper : ColorTileWrapper}
`;

const ImagePanelIcon = styled.img`
  width: 100%;
  height: 100%;

  background-position: center;
  border-radius: inherit;

  transition: opacity 700ms;
  opacity: ${(props) => (props.hidden ? 0 : 1)};
`;

const TileTitle = styled.div`
  width: 100%;
  min-height: 30px;

  line-height: 1.6;
  font-size: 13px;

  padding: 8px 16px;

  overflow: hidden;
  text-overflow: ellipsis;

  white-space: nowrap;
  vertical-align: middle;

  user-select: none;
  color: red;
`;

// Private helper component to display a single image in a CustomizePanel.
class ImagePanelRaw extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      imageLoaded: false,
    };
  }

  onClick(e) {
    this.props.onClick();
    e.preventDefault();
  }

  render() {
    const hidden = this.props.fadeInIcon && !this.state.imageLoaded;

    if (hidden) {
      LoadImage(this.props.icon, () => this.setState({ imageLoaded: true }));
    }

    const selected = <SelectedOption small={this.props.smallSelectionIcon} />;

    const selectedIcon = this.props.selected ? selected : null;
    const selectedClass = this.props.selected ? 'selected' : '';

    const title = this.props.showTitles ? (
      <TileTitle>
        <Typography variant="body2">{this.props.title}</Typography>
      </TileTitle>
    ) : null;

    if (this.props.id === 'customize-menu-custom-color') {
      return (
        <ImagePanelTileWrapper>
          {CustomColor(this.props.onClick, this.props.theme)}
        </ImagePanelTileWrapper>
      );
    }

    return (
      <ImagePanelTileWrapper
        className={`${selectedClass}`}
        type={this.props.type}
      >
        <ImagePanelTile onClick={(e) => this.onClick(e)} role="button">
          {this.props.defaultIcon ? (
            this.props.defaultIcon
          ) : (
            <ImagePanelIcon
              id={this.props.iconId}
              src={this.props.icon}
              alt={this.props.title}
              title={this.props.title}
              onDragStart={(e) => e.preventDefault()}
              hidden={hidden}
            />
          )}
        </ImagePanelTile>
        {selectedIcon}
        {title}
      </ImagePanelTileWrapper>
    );
  }
}

const ImagePanel = withTheme(ImagePanelRaw);

// Helper component to display a tab in a CustomizeMenu instance. This component
// is specifically for displaying a series of images representing that tab's
// options, as well as a default option if desired.
class CustomizePanel extends React.Component {
  constructor(props) {
    super(props);

    // Reference to the scrolling div, to allow parent components to control the
    // scroll bar's position.
    this.scroll = null;
  }

  defaultSelected() {
    if (this.props.defaultSelected) {
      this.props.defaultSelected();
    }
  }

  optionSelected(option) {
    if (this.props.optionSelected) {
      this.props.optionSelected(option);
    }
  }

  selectDefaultIcon(type) {
    if (type === 'background') {
      return (
        <ImagePanel
          fadeInIcon={this.props.fadeInIcons}
          icon={this.props.defaultIcon}
          showTitles={this.props.showTitles}
          title={this.props.defaultTitle}
          smallSelectionIcon={this.props.smallSelectionIcon}
          selected={this.props.selectedOption === null}
          onClick={() => this.defaultSelected()}
          type={type}
        />
      );
    } else if (type === 'color') {
      return (
        <ImagePanel
          fadeInIcon={this.props.fadeInIcons}
          defaultIcon={<ColorDefaultIcon />}
          icon={this.props.defaultIcon}
          showTitles={this.props.showTitles}
          title={this.props.defaultTitle}
          smallSelectionIcon={this.props.smallSelectionIcon}
          selected={this.props.selectedOption === null}
          onClick={() => this.defaultSelected()}
          type={type}
        />
      );
    }
  }

  render() {
    const defaultOption =
      this.props.type && this.props.defaultTitle
        ? this.selectDefaultIcon(this.props.type)
        : null;

    return (
      <MenuPanel ref={(div) => (this.scroll = div)} role="tabpanel">
        {defaultOption}

        {this.props.options.map((option, index) => {
          const optionIcon = this.props.optionIcon(option);
          const title = this.props.optionLabel(option);

          // Form a unique key for each image URL. React will re-use components
          // that have the same key, but we want each ImagePanel's loaded state
          // to be unique for each image URL.
          const key = `${index}_${optionIcon}`;

          return (
            <ImagePanel
              key={key}
              id={this.props.optionId(option)}
              className={this.props.className}
              fadeInIcon={this.props.fadeInIcons}
              defaultIcon={
                option.collectionId === 'local_background' ? (
                  <UploadBackgroundIcon />
                ) : null
              }
              icon={optionIcon}
              iconId={this.props.optionIconId(option)}
              showTitles={this.props.showTitles}
              title={title}
              smallSelectionIcon={this.props.smallSelectionIcon}
              selected={
                this.props.selectedOption === option ||
                this.props.selectedOption === option.collectionId
              }
              onClick={() => this.optionSelected(option)}
              type={this.props.type}
            />
          );
        })}
      </MenuPanel>
    );
  }
}

export default withTheme(CustomizePanel);
