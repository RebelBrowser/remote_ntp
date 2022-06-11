import React from 'react';
import { Create, Link } from '@material-ui/icons';
import { withTheme, Fab } from '@material-ui/core';
import styled, { css } from 'styled-components';

const selectBackgroundColor = (isTransparent, theme) => {
  if (isTransparent) return 'transparent';
  if (theme.browser.darkModeEnabled) return '#32424e';
  return '#F0F2F4';
};

const selectFontColor = (isTransparent, theme) => {
  if (isTransparent) return 'white';
  return theme.palette.primary.main;
};

const IconStyle = css`
  margin-inline-start: ${(props) => (props.wide ? '8px' : '0px')};
`;

const CreateIcon = styled(({ wide, ...otherProps }) => (
  <Create {...otherProps} />
))`
  ${IconStyle}
`;

const LinkIcon = styled(({ wide, ...otherProps }) => <Link {...otherProps} />)`
  ${IconStyle}
`;

const StyledBubble = styled(({ transparent, ...otherProps }) => (
  <Fab {...otherProps} />
))`
  box-shadow: none;
  background-color: ${(props) =>
    selectBackgroundColor(props.transparent, props.theme)};

  color: ${(props) => selectFontColor(props.transparent, props.theme)};
  font-weight: 600;
  display: flex;
  justify-content: center;
  min-width: 32px;
  width: fit-content;
  height: 32px;
  align-items: center;
  border: none;
  border-radius: 500px;
  cursor: pointer;

  &:hover {
    background-color: ${(props) =>
      props.transparent ? 'rgba(255, 255, 255, .1)' : 'transparent'};
  }
`;

const StyledBubbleText = styled.span`
  font-size: 13px;
  line-height: 30px;

  padding-inline-end: 8px;
  padding-inline-start: 8px;

  user-select: none;
`;

class Bubble extends React.Component {
  onClick(e) {
    e.preventDefault();

    if (this.props.onClick) {
      this.props.onClick();
    }
  }

  onMouseEnter(e) {
    if (this.props.onMouseEnter) {
      e.preventDefault();
      this.props.onMouseEnter();
    }
  }

  onMouseLeave(e) {
    if (this.props.onMouseLeave) {
      e.preventDefault();
      this.props.onMouseLeave();
    }
  }

  render() {
    let icon = null;
    if (this.props.icon === 'Link') {
      icon = <LinkIcon wide={this.props.wide} />;
    } else if (this.props.icon) {
      icon = <CreateIcon wide={this.props.wide} />;
    }

    return (
      <StyledBubble
        id={this.props.id}
        transparent={this.props.transparent}
        title={this.props.title}
        aria-label={this.props.title}
        tabIndex="0"
        onClick={(e) => this.onClick(e)}
        onMouseEnter={(e) => this.onMouseEnter(e)}
        onMouseLeave={(e) => this.onMouseLeave(e)}
      >
        {icon}
        {this.props.wide ? (
          <StyledBubbleText>{this.props.text}</StyledBubbleText>
        ) : null}
      </StyledBubble>
    );
  }
}

export default withTheme(Bubble);
