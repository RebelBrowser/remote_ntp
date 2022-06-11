import { css } from 'styled-components';

const TileMediaVariables = css`
  /* Defaults */
  --tile-padding-bottom: 10px;
  --tile-padding-horizontal: 10px;

  --tile-icon-wrapper-size: 85px;
  --tile-icon-border-radius: 22%;
  --tile-icon-size-small: 64px;
  --tile-icon-size-large: var(--tile-icon-wrapper-size);
  --tile-icon-margin-bottom: 5px;

  --tile-title-height: 12px;
  --tile-title-max-height: 28px;
  --tile-title-width: calc(var(--tile-icon-wrapper-size) + 7px);

  --tile-background-darkMode: #32424e;
  --tile-background-lightMode: #ffffff;
  --tile-addTile-background-lightMode: #f0f2f4;

  /* Tablets and Desktop */
  @media (min-width: 500px) {
    --max-tiles-per-row: 6; /* Note: this is actually max tiles per row + 1 */
    --tile-height: 112px;
    --tile-width: 112px;
    --tile-padding-top: 16px;
    --tile-margin-bottom: 6px;
    --tile-title-font-size: 14px;
  }

  /* Phones */
  @media (max-width: 500px) and (min-width: 321px) {
    --max-tiles-per-row: 5;
    --tile-height: 70px;
    --tile-width: 70px;
    --tile-icon-wrapper-size: 65px;
    --tile-padding-top: 10px;
    --tile-margin-bottom: 30px;
    --tile-title-font-size: 12px;
    --tile-title-width: calc(var(--tile-icon-wrapper-size) + 15px);
  }

  /* iPhone 5 and smaller */
  @media (max-width: 321px) {
    --max-tiles-per-row: 5; /* Note: this is actually max tiles per row + 1 */
    --tile-height: 70px;
    --tile-width: 70px;
    --tile-icon-wrapper-size: 60px;
    --tile-padding-top: 10px;
    --tile-margin-bottom: 30px;
    --tile-title-font-size: 11px;
    --tile-title-width: calc(var(--tile-icon-wrapper-size) + 7px);
  }
`;

export default TileMediaVariables;
