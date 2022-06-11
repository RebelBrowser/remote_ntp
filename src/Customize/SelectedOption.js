import React from 'react';
import styled from 'styled-components';
import { Check } from '@material-ui/icons';

const SelectedCircle = styled.div`
  background: ${(props) =>
      props.theme.browser.darkModeEnabled ? '#202e39' : 'white'}
    no-repeat center;

  width: 24px;
  height: 24px;

  position: absolute;
  top: ${(props) => (props.small ? '0px' : '8px')};
  right: ${(props) => (props.small ? '0px' : '8px')};

  border-radius: 50%;
`;

const SelectedCheck = styled(({ small, ...otherProps }) => (
  <Check {...otherProps} />
))`
  position: absolute;

  fill: ${(props) => (props.theme.browser.darkModeEnabled ? 'white' : 'black')};
  top: ${(props) => (props.small ? '0px' : '8px')};
  right: ${(props) => (props.small ? '0px' : '8px')};
`;

// Helper component to display a check mark on an option when it is selected.
const SelectedOption = (props) => {
  return (
    <React.Fragment>
      <SelectedCircle small={props.small} />
      <SelectedCheck small={props.small} />
    </React.Fragment>
  );
};

export default SelectedOption;
