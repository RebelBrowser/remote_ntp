import React from 'react';
import { Typography } from '@material-ui/core';
import styled from 'styled-components';

const ToggleContainer = styled.div`
  width: 94.5%;
  display: flex;
  justify-content: space-between;
  padding-top: 5px;
  font-weight: bolder;

  @media (max-width: 600px) {
    width: 92%;
  }
`;

const StyledH1 = styled(({ isToggled, ...otherProps }) => (
  <Typography {...otherProps} />
))`
  cursor: ${(props) => (props.isToggled === null ? '' : 'pointer')};
`;

const StyledSubheader = styled(({ isToggled, ...otherProps }) => (
  <Typography {...otherProps} />
))`
  align-self: center;
  cursor: pointer;
`;

class Toggle extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isToggled: false, // false = close, true = open, null = means no toggle
      title: '',
    };
  }

  static getDerivedStateFromProps(props, state) {
    return {
      isToggled: props.isToggled,
      title: props.title,
    };
  }

  render() {
    return (
      <ToggleContainer isToggled={true}>
        <StyledH1
          variant="h2"
          isToggled={this.state.isToggled}
          onClick={this.props.onClickOverride}
        >
          {this.state.title}
        </StyledH1>

        {this.state.isToggled !== null
          ? (() => {
              let title = this.state.isToggled ? 'HIDE' : 'SHOW';
              return (
                <StyledSubheader
                  onClick={this.props.onClickOverride}
                  variant="h3"
                >
                  {title}
                </StyledSubheader>
              );
            })()
          : null}
      </ToggleContainer>
    );
  }
}

export default Toggle;
