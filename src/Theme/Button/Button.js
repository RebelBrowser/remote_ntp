import React from 'react';
import { Button as MuiButton } from '@material-ui/core';

class Button extends React.Component {
  // This prevents a blue border from appearing around the button when it is
  // clicked via a mouse. Only prevent it for mouse clicks; for accessibility,
  // the blue border should still be shown on e.g. tab navigation.
  disableOutlineOnMouseClick(e) {
    const element = e.target;

    element.classList.add('mouse-navigation');

    element.addEventListener(
      'blur',
      () => {
        element.classList.remove('mouse-navigation');
      },
      { once: true }
    );
  }

  onClick(e) {
    if (this.props.onClick) {
      e.preventDefault();
      this.props.onClick();
    }
  }

  render = () => (
    <MuiButton
      id={this.props.id}
      color={this.props.primary ? 'primary' : 'secondary'}
      disableElevation
      type={this.props.type}
      variant={this.props.variant ? this.props.variant : 'contained'}
      size="small"
      disabled={this.props.disabled}
      title={this.props.text}
      aria-label={this.props.text}
      onClick={(e) => this.onClick(e)}
      onMouseDown={(e) => this.disableOutlineOnMouseClick(e)}
    >
      {this.props.text}
    </MuiButton>
  );
}

export default Button;
