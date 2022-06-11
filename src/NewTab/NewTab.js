import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';

import './NewTab.css';
import Strings from './Strings';
import styled from 'styled-components';

import Background from '../Background/Background';
import Customize from '../Customize/Customize';
import Footer from './../Footer';
import Logo from './../Logo';
import Notification from '../Notification';
import Search from './../Search';
import BrowserThemeProvider from './../Theme';
import { default as Tiles, StaticTiles } from './../Tiles';
import Divider from './../Divider';

const Wrapper = styled.div`
  max-width: 615px;
  margin: auto;
  @media (max-width: 768px) {
    padding: 0px 10px;
  }
`;

class NewTab extends React.Component {
  componentDidMount() {
    document.title = Strings.title;
  }

  render = () => {
    return (
      <BrowserThemeProvider>
        <CssBaseline />
        <Wrapper>
          <Background />
          <Logo />
          <Search />
          <Notification />
          <Divider />
          <Tiles />
          <Divider />
          <StaticTiles />
          <Customize />
          <Footer />
        </Wrapper>
      </BrowserThemeProvider>
    );
  };
}

export default NewTab;
