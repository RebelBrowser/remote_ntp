import React from 'react';

import Strings from './Strings.js';
import Tile from '../Tile/Tile';
import { TilesWrapper, TilesContainer } from '..';
import Toggle from '../../Toggle/Toggle';

export const STATIC_TILES = [
  {
    title: Strings.settings,
    url: 'rebel://settings',
    favicon_url: null,
    muiIcon: 'settings',
    enabled: () => true,
  },
  {
    title: Strings.history,
    url: 'rebel://history',
    favicon_url: null,
    muiIcon: 'history',
    enabled: () => true,
  },
  {
    title: Strings.speed_check,
    url: 'https://speedcheck.viasat.com/',
    favicon_url: null,
    muiIcon: 'speedcheck',
    enabled: () => true,
  },
];

class Venue extends React.Component {
  constructor(props) {
    super(props);

    this.state = this.getInitalStateFromLocalStorage();
  }

  getInitalStateFromLocalStorage = () => {
    let state = {
      isToggled: true,
      tiles: STATIC_TILES,
    };

    const venueToggle = localStorage.getItem('venueToggle');

    if (venueToggle === null) {
      state.isToggled = true;
    } else {
      state.isToggled = venueToggle === 'true';
    }

    return state;
  };

  venueToggleHandler(e) {
    let toggled = this.state.isToggled;
    localStorage.setItem('venueToggle', !toggled);
    this.setState({ isToggled: !toggled });
  }

  render() {
    const tiles = this.state.tiles;

    return (
      <TilesContainer data-testid="Venue">
        <Toggle
          title="Rebel Pages"
          isToggled={this.state.isToggled}
          onClickOverride={(e) => this.venueToggleHandler(e)}
        />

        {this.state.isToggled ? (
          <TilesWrapper>
            {tiles.map((tile, index) =>
              tile.enabled() ? (
                <Tile
                  key={index}
                  title={tile.title}
                  url={tile.url}
                  faviconUrl={tile.favicon_url}
                  muiIcon={tile.muiIcon}
                />
              ) : null
            )}
          </TilesWrapper>
        ) : null}
      </TilesContainer>
    );
  }
}

export default Venue;
