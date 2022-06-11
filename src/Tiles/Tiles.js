import React from 'react';
import styled from 'styled-components';

import Tile from './Tile/Tile';
import Toggle from '../Toggle';

const BrowserAPI = require('browser-api');

export const TilesContainer = styled.div`
  margin: 0;
  padding: 0;
  width: 100%;

  user-select: none;

  display: flex;
  flex-wrap: wrap;

  position: static;
  justify-content: center;

  background: none transparent;
`;

export const TilesWrapper = styled.div`
  padding-top: 10px;
  width: 100%;

  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-row-gap: 0.5rem;
  justify-items: center;

  position: static;

  @media (max-width: 630px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

class Tiles extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tiles: [],
      showAddTile: false,
    };
  }

  componentDidMount() {
    BrowserAPI.tiles.addObserver((tiles) => this.onTilesChanged(tiles));
  }

  onTilesChanged(tiles) {
    // TODO make an API for querying the max number of tiles from the browser
    const tiles_per_row = window.outerWidth >= 500 ? 10 : 8;
    const showAddTile = tiles.length >= tiles_per_row ? false : true;

    this.setState({
      tiles: tiles,
      showAddTile: showAddTile,
    });
  }

  render() {
    const addShortcutTile = !this.state.showAddTile ? null : (
      <Tile
        key={this.state.tiles.length}
        url={null}
        faviconUrl={null}
        canEdit={false}
        isAddShortcut={true}
        muiIcon={'add'}
        title={'Add shortcut'}
      />
    );

    return (
      <TilesContainer data-testid="Tiles">
        <Toggle title="Top sites" isToggled={null} />
        <TilesWrapper>
          {this.state.tiles.map((tile) => (
            <Tile
              key={tile.url}
              title={tile.title}
              url={tile.url}
              faviconUrl={tile.favicon_url}
              canEdit={true}
            />
          ))}
          {addShortcutTile}
        </TilesWrapper>
      </TilesContainer>
    );
  }
}

export default Tiles;
