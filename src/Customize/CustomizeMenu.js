import React from 'react';

import CustomizeBackgrounds from './Backgrounds/CustomizeBackgrounds.js';
import CustomizeColors from './Colors/CustomizeColors.js';
import Strings from './Strings.js';
import { ThemedButton, ThemedButtonGroup, ThemedForm } from './../Theme';

const BrowserAPI = require('browser-api');

// Form for configuring the page. Displays tabbed panels for each category of
// options, which are currently Backgrounds and Colors. Each tab may have
// sub-panel navigation. That is, clicking on an option in a tab may change the
// contents of the tab, with the option to navigate back.
class CustomizeMenu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTitle: Strings.customize_full,
      backButtonActive: false,
      backButtonAction: null,
    };
  }

  componentWillUnmount() {
    this.setState({
      backButtonActive: false,
      backButtonAction: null,
    });
  }

  showBackButton(title, backButtonAction) {
    title = title || Strings.customize_full;

    this.setState({
      activeTitle: title,
      backButtonActive: backButtonAction !== null,
      backButtonAction: backButtonAction,
    });
  }

  resetState() {
    if (this.state.backButtonAction) {
      this.state.backButtonAction();
    }

    this.setState({
      activeTitle: Strings.customize_full,
      backButtonActive: false,
      backButtonAction: null,
    });
  }

  closeDialog() {
    BrowserAPI.theme.revertPendingChanges();
    this.props.closeCallback();
  }

  onSubmit() {
    BrowserAPI.theme.commitPendingChanges();
    this.props.closeCallback();
  }

  render() {
    const panels = [
      {
        title: Strings.backgrounds.title,
        icon: 'wallpaper',
        body: (
          <CustomizeBackgrounds
            panelChange={(title, backButtonAction) =>
              this.showBackButton(title, backButtonAction)
            }
            closeDialog={() => this.closeDialog()}
          />
        ),
      },
      {
        title: Strings.colors.title,
        icon: 'color',
        body: <CustomizeColors />,
      },
    ];

    const buttons = (
      <ThemedButtonGroup align="right">
        <ThemedButton
          id="cancel"
          text={Strings.cancel}
          type="button"
          variant="outlined"
          primary={true}
          onClick={() => this.closeDialog()}
        />
        <ThemedButton
          id="done"
          text={Strings.submit}
          type="submit"
          primary={true}
        />
      </ThemedButtonGroup>
    );

    const backButtonAction = this.state.backButtonActive
      ? () => this.resetState()
      : null;

    return (
      <React.Fragment>
        <ThemedForm
          formId={'CustomizePanel'}
          title={this.state.activeTitle}
          panels={panels}
          panelChange={() => this.resetState()}
          buttons={buttons}
          backButtonAction={backButtonAction}
          onSubmit={() => this.onSubmit()}
          onDismiss={() => this.closeDialog()}
        />
      </React.Fragment>
    );
  }
}

export default CustomizeMenu;
