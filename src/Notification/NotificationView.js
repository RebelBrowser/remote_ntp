import React from 'react';
import styled from 'styled-components';
import { Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { withTheme } from 'styled-components';

const BrowserAPI = require('browser-api');

const NotificationContainer = styled.div`
  min-width: 320px;
  min-height: 100px;

  padding-left: 10px;
  padding-right: 10px;

  z-index: 10000;

  display: flex;
  align-items: center;
  justify-content: center;

  margin-top: 3vh;
  margin-bottom: -1vh;
`;

// Prettier formats the dynamic CSS rules based on |props| really badly.
// prettier-ignore
const Notification = styled.dialog`
  ${(props) => props.severe ? `
    color: white;
    background-color: var(--color-red9);
  ` : `
    color: ${props.theme.inverted.palette.background.main};
    background-color: ${props.theme.inverted.palette.background.main};
  `};

  display: flex;
  position: relative;

  border: none;
  border-radius: 8px;
  box-shadow: ${(props) => props.theme.shadows[3]};

  margin: auto;
  padding: 16px 16px 24px 0px;

  &::backdrop {
    background: transparent;
  }
`;

const NotificationHeader = styled.div`
  display: flex;
  justify-content: flex-start;

  margin-inline-start: 16px;
  margin-bottom: 36px;

  padding-left: 5px;
  padding-right: 5px;

  & p {
    line-height: 1.3em;

    margin: 0;
    padding: 0;
  }
`;

const NotificationFooter = styled.div`
  width: calc(100% - 32px);

  position: absolute;
  bottom: 0;
  left: 0;

  margin-inline-start: 16px;
  margin-inline-end: -32px;
  margin-bottom: 14px;

  user-select: none;
`;

const NotificationView = (props) => {
  const NotificationTitle = withStyles({
    root: {
      fontFamily: 'UniNeueBold',
      fontSize: BrowserAPI.platform.isMobile() ? 16 : 18,
      fontWeight: props.theme.inverted.typography.h2.fontWeight,
      color: props.severe ? 'white' : props.theme.inverted.typography.h2.color,
    },
  })(Typography);

  const align = BrowserAPI.platform.isMobile() ? 'bottom' : 'top';

  return (
    <NotificationContainer id="notification" align={align}>
      <Notification severe={props.severe} open>
        <NotificationHeader>
          <NotificationTitle variant="h2">{props.title}</NotificationTitle>
        </NotificationHeader>

        <NotificationFooter>{props.buttons}</NotificationFooter>
      </Notification>
    </NotificationContainer>
  );
};

export default withTheme(NotificationView);
