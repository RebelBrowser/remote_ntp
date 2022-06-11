import React from 'react';
import styled from 'styled-components';

import Strings from './Strings.js';

const selectFooterTextColor = (isDarkMode, hasBackground) => {
  if (hasBackground || isDarkMode) return 'white';
  return 'black';
};

const StyledFooter = styled.footer`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 3px;

  padding-top: var(--footer-height);
  padding-bottom: var(--footer-height);

  font-size: small;
  font-weight: 500;

  color: ${(props) =>
    selectFooterTextColor(
      props.theme.browser.darkModeEnabled,
      props.theme.browser.background.imageUrl.length !== 0
    )};

  z-index: 3;
`;

const StyledFooterItem = styled.span``;

const Footer = () => {
  return (
    <StyledFooter data-testid="Footer">
      <StyledFooterItem>
        {Strings.formatString(Strings.copyright, {
          symbol: <span>&copy;</span>,
        })}
      </StyledFooterItem>
    </StyledFooter>
  );
};

export default Footer;
