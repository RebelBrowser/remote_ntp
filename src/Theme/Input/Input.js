import React from 'react';
import { TextField } from '@material-ui/core';
import styled from 'styled-components';

const BrowserAPI = require('browser-api');

const Wrapper = styled.div`
  margin-bottom: 16px;
  width: 300px;
`;

const InputWrapper = styled.div`
  position: relative;
`;

const StyledInput = styled(TextField)`
  margin-top: 10px;
  input {
    color: ${(props) =>
      props.theme.browser.darkModeEnabled ? 'white' : 'black'};
    font-weight: 500;
  }
`;

// On iOS, WebKit zooms in on input fields when the input font size is less than
// 16px. Prevent this by setting the font size to 16, then applying a scale
// transform of <desired font size> / 16.
const StyledInputIOS = styled(StyledInput)`
  @media screen and (-webkit-min-device-pixel-ratio: 0) {
    input {
      font-size: 16px;

      transform: scale(0.875);
      transform-origin: left bottom;
    }
  }
`;

class Input extends React.Component {
  onChange(e) {
    this.props.onChange(e.target.value);
  }

  render() {
    const props = {
      onChange: (e) => this.onChange(e),
      label: this.props.title,
      value: this.props.value,
      autoComplete: this.props.autocorrect ? 'on' : 'off',
      autoCorrect: this.props.autocorrect ? 'on' : 'off',
      spellCheck: this.props.autocorrect ? 'true' : 'false',
      autoFocus: this.props.focused,
      variant: 'filled',
      fullWidth: true,
    };

    const input = BrowserAPI.platform.isIOS() ? (
      <StyledInputIOS {...props} />
    ) : (
      <StyledInput {...props} />
    );

    return (
      <Wrapper>
        <InputWrapper>{input}</InputWrapper>
      </Wrapper>
    );
  }
}

export default Input;
