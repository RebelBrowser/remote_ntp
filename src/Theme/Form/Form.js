import React from 'react';

import FormView from './FormView';

class Form extends React.Component {
  constructor(props) {
    super(props);

    this.keyPressListener = (e) => this.handleEscapePress(e);

    this.state = {
      activePanel: 0,
    };
  }

  componentDidMount() {
    document.addEventListener('keydown', this.keyPressListener, false);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.keyPressListener, false);
  }

  onPanelChange(index) {
    this.setState({ activePanel: index });
    this.props.panelChange();
  }

  onBackButton(e) {
    e.preventDefault();
    this.props.backButtonAction();
  }

  onSubmit(e) {
    if (this.props.onSubmit) {
      this.props.onSubmit();
      e.preventDefault();
    }
  }

  onDismiss(e) {
    if (this.props.onDismiss) {
      this.props.onDismiss();
      e.preventDefault();
    }
  }

  handleEscapePress(e) {
    if (e.key === 'Escape') {
      this.onDismiss(e);
    }
  }

  handleCloseClick(e) {
    if (e.target.id === 'themed-form-container') {
      this.onDismiss(e);
    }
  }

  render = () => (
    <FormView
      panels={this.props.panels}
      onPanelChange={(e) => this.onPanelChange(e)}
      activePanel={this.state.activePanel}
      handleCloseClick={(e) => this.handleCloseClick(e)}
      //
      backButtonAction={this.props.backButtonAction}
      onBackButton={(e) => this.onBackButton(e)}
      //
      title={this.props.title}
      //
      formId={this.props.formId}
      buttons={this.props.buttons}
      onSubmit={(e) => this.onSubmit(e)}
      //
      // Allow displaying the form in a non-modal style.
      modal={typeof this.props.modal === 'undefined' ? true : this.props.modal}
      //
      // Allow aligning the form on the top, center, or bottom of the window.
      align={
        typeof this.props.align === 'undefined' ? 'center' : this.props.align
      }
    />
  );
}

export default Form;
