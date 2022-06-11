import React from 'react';
import styled from 'styled-components';

const selectAlignment = (align) => {
  if (align === 'left') {
    return 'flex-start';
  } else if (align === 'center') {
    return 'center';
  } else if (align === 'right') {
    return 'flex-end';
  }
  return 'space-between';
};

const StyledButtonGroup = styled.div`
  display: flex;
  justify-content: ${(props) => selectAlignment(props.align)};
  flex-wrap: wrap;

  margin-top: 0px;

  & button {
    margin-top: 8px;
  }

  & button + button {
    margin-inline-start: 8px;
  }
`;

class ButtonGroup extends React.Component {
  render() {
    return (
      <StyledButtonGroup align={this.props.align}>
        {this.props.children}
      </StyledButtonGroup>
    );
  }
}

export default ButtonGroup;
