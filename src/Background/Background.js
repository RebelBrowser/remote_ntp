import React from 'react';
import styled from 'styled-components';
import { withTheme } from '@material-ui/core/styles';

import { LoadImage } from './../Util';
import { ThemedBubble } from './../Theme';

const BackgroundWrapper = styled.div`
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.3)),
    ${(props) => props.url};

  width: 100%;
  height: 100%;

  position: fixed;
  top: 0;
  left: 0;

  margin: 0;
  padding: 0;

  background-size: cover;

  transition: opacity 700ms;

  z-index: -1000;
  opacity: ${(props) => (props.hidden ? 0 : 1)};
`;

const AttributionWrapper = styled.div`
  display: flex;
  flex-direction: column;

  position: fixed;
  left: 16px;
  bottom: 6px;

  z-index: 100;

  & button {
    margin-top: -8px;
  }
`;

const AttributionImage = styled.img`
  opacity: ${(props) => (props.hidden ? 0 : 1)};
`;

class Background extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loadedBackground: null,
      loadedAttribution: null,
    };
  }

  handleClick(url) {
    window.location.href = url;
  }

  render() {
    const background = this.props.theme.browser.background;

    const backgroundImageUrl = background.imageUrl;
    const backgroundImageHidden =
      this.state.loadedBackground !== backgroundImageUrl;

    const attributionImageUrl = background.attributionImageUrl;
    const attributionImageHidden =
      this.state.loadedAttribution !== attributionImageUrl;

    if (backgroundImageUrl.length === 0) {
      return null;
    }

    if (backgroundImageHidden) {
      LoadImage(backgroundImageUrl, (imageUrl) =>
        this.setState({
          loadedBackground: imageUrl,
        })
      );
    }

    if (
      attributionImageHidden &&
      attributionImageUrl &&
      attributionImageUrl.length > 0
    ) {
      LoadImage(attributionImageUrl, (imageUrl) =>
        this.setState({
          loadedAttribution: imageUrl,
        })
      );
    }

    const attributionLine1 = background.attributionLine1;
    const attributionLine2 = background.attributionLine2;
    const attributionUrl = background.attributionUrl;

    const attribution1 =
      attributionLine1.length === 0 ? null : (
        <ThemedBubble
          text={attributionLine1}
          icon={'Link'}
          wide={true}
          transparent={true}
          onClick={(e) => this.handleClick(attributionUrl)}
        />
      );

    const attribution2 =
      attributionLine2.length === 0 ? null : (
        <ThemedBubble
          text={attributionLine2}
          icon={null}
          wide={true}
          transparent={true}
          onClick={(e) => this.handleClick(attributionUrl)}
        />
      );

    return (
      <React.Fragment>
        <BackgroundWrapper
          data-testid="Background"
          hidden={backgroundImageHidden ? true : false}
          url={`url(${backgroundImageUrl})`}
        />

        <AttributionWrapper>
          {attribution1}
          {attribution2}

          <AttributionImage
            src={attributionImageUrl}
            hidden={attributionImageHidden ? true : false}
            alt="Attribution"
            onDragStart={(e) => e.preventDefault()}
          />
        </AttributionWrapper>
      </React.Fragment>
    );
  }
}

export default withTheme(Background);
