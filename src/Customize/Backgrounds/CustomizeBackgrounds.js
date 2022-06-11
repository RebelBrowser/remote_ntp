import React from 'react';
import { withTheme } from '@material-ui/core/styles';

import CustomizeBackgroundsView from './CustomizeBackgroundsView';
import Strings from '../Strings.js';
import background_local from './background_local.svg';

const BrowserAPI = require('browser-api');

// Panel to allow the user to choose the background page's background image. The
// available images are retrieved from the browser.
class CustomizeBackgrounds extends React.Component {
  constructor(props) {
    super(props);

    this.panel = null;

    // A pseudo background collection to allow the user to select a local image
    // as their background image.
    this.localBackground = {
      collectionId: 'local_background',
      collectionName: Strings.backgrounds.custom,
      previewImageUrl: background_local,
    };

    this.state = {
      showCollections: false,
      selectedCollection: null,
      collections: [],

      showBackgrounds: false,
      selectedBackground: null,
      backgrounds: {},
    };
  }

  componentDidMount() {
    BrowserAPI.theme.addBackgroundCollectionsObserver((collections) =>
      this.onBackgroundCollectionsChanged(collections)
    );
    BrowserAPI.theme.addBackgroundImagesObserver((backgrounds) =>
      this.onBackgroundImagesChanged(backgrounds)
    );
    BrowserAPI.theme.addLocalBackgroundImageSelectedObserver(() =>
      this.onLocalBackgroundImageSelected()
    );

    this.setState({
      showCollections: true,
      showBackgrounds: false,
    });
  }

  componentWillUnmount() {
    if (this.props.panelChange) {
      this.props.panelChange(null, null);
    }
  }

  onBackgroundCollectionsChanged(collections) {
    let mutableCollections = collections.slice();

    // Insert the local background picker at the beginning.
    if (BrowserAPI.theme.supportsLocalImageAsBackground()) {
      mutableCollections.unshift(this.localBackground);
    }

    this.setState({
      collections: mutableCollections,
    });
  }

  onBackgroundImagesChanged(backgrounds) {
    const showBackgrounds =
      this.state.selectedCollection !== null &&
      backgrounds.hasOwnProperty(this.state.selectedCollection.collectionId);
    const showCollections = !showBackgrounds;

    if (showBackgrounds && this.panel) {
      this.panel.scroll.scrollTop = 0;
    }

    this.setState({
      showCollections: showCollections,
      showBackgrounds: showBackgrounds,

      backgrounds: backgrounds,
    });
  }

  onLocalBackgroundImageSelected() {
    if (this.props.closeDialog) {
      this.props.closeDialog();
    }
  }

  selectCollection(collection) {
    if (collection.collectionId === this.localBackground.collectionId) {
      BrowserAPI.theme.selectLocalBackgroundImage();
      return;
    }

    if (this.props.panelChange) {
      this.props.panelChange(collection.collectionName, () =>
        this.navigateBack()
      );
    }

    if (this.state.backgrounds.hasOwnProperty(collection.collectionId)) {
      if (this.panel) {
        this.panel.scroll.scrollTop = 0;
      }

      this.setState({
        selectedCollection: collection,

        showCollections: false,
        showBackgrounds: true,
      });
    } else {
      BrowserAPI.theme.loadBackgroundImages(collection);

      this.setState({
        selectedCollection: collection,
      });
    }
  }

  selectBackground(background) {
    BrowserAPI.theme.previewBackgroundImage(
      this.state.selectedCollection,
      background
    );

    this.setState({
      selectedBackground: background,
    });
  }

  navigateBack() {
    if (this.panel) {
      this.panel.scroll.scrollTop = 0;
    }

    this.setState({
      selectedCollection: null,

      showCollections: true,
      showBackgrounds: false,
    });
  }

  render() {
    let selectedBackground = this.state.selectedBackground;
    const collectionId = this.props.theme.browser.background.collectionId;

    if (selectedBackground === null && collectionId.length !== 0) {
      if (collectionId === this.localBackground.collectionId) {
        selectedBackground = this.localBackground;
      } else if (this.state.backgrounds.hasOwnProperty(collectionId)) {
        const backgrounds = this.state.backgrounds[collectionId];
        const imageUrl = this.props.theme.browser.background.imageUrl;

        selectedBackground = backgrounds.find((b) => b.imageUrl === imageUrl);
      } else {
        // The user hasn't clicked the collection holding the background image.
        // Set to non-null so the default background is not shown as selected.
        selectedBackground = {};
      }
    }

    if (this.state.showCollections) {
      return (
        <CustomizeBackgroundsView
          showTitles={true}
          fadeInIcons={true}
          //
          defaultTitle={Strings.backgrounds.default}
          defaultSelected={() => this.selectBackground(null)}
          type="background"
          //
          options={this.state.collections}
          optionId={(o) => null}
          optionIcon={(o) => o.previewImageUrl}
          optionIconId={(o) => null}
          optionLabel={(o) => o.collectionName}
          optionSelected={(collection) => this.selectCollection(collection)}
          //
          smallSelectionIcon={false}
          selectedOption={collectionId !== '' ? collectionId : null}
        />
      );
    } else if (this.state.showBackgrounds) {
      const selected = this.state.selectedCollection;
      const backgrounds = this.state.backgrounds[selected.collectionId] || [];

      return (
        <CustomizeBackgroundsView
          fadeInIcons={true}
          //
          options={backgrounds}
          optionId={(o) => null}
          optionIcon={(o) => o.thumbnailUrl}
          optionIconId={(o) => null}
          optionLabel={(o) => o.attributionLine1}
          optionSelected={(background) => this.selectBackground(background)}
          type="background"
          //
          smallSelectionIcon={false}
          selectedOption={selectedBackground}
        />
      );
    }

    return null;
  }
}

export default withTheme(CustomizeBackgrounds);
