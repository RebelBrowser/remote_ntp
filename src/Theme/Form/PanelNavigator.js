import React from 'react';

import PanelNavigatorView from './PanelNavigatorView';

class PanelNavigator extends React.Component {
  onClick(e) {
    this.props.onClick(this.props.index);
    e.preventDefault();
  }

  render() {
    const activeClass = this.props.active ? true : false;

    return (
      <PanelNavigatorView
        active={activeClass}
        icon={this.props.icon}
        text={this.props.text}
        onClick={(e) => this.onClick(e)}
      />
    );
  }
}

export default PanelNavigator;
