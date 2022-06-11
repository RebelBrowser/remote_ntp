import React from 'react';

import {
  ThemedButton,
  ThemedButtonGroup,
  ThemedForm,
  ThemedInput,
} from '../../Theme';

const BrowserAPI = require('browser-api');

class ShortcutPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      values: {
        name: props.name || '',
        url: props.url || '',
        old_url: props.url,
        old_name: props.name,
      },
      isSubmitDisabled: !this.props.isEdit,
      isRemoveDisabled: !this.props.isEdit,
    };
  }

  closeDialog() {
    this.props.closeCallback();
  }

  onChange(key, value) {
    let state = this.state;

    state.values[key] = value;
    state.isSubmitDisabled = Object.values(state.values).some((v) => v === '');

    this.setState(state);
  }

  onSubmit() {
    const new_url = this.state.values.url;
    const new_title = this.state.values.name;

    if (this.props.isEdit) {
      BrowserAPI.tiles.editTile(this.state.values.old_url, new_url, new_title);
    } else {
      BrowserAPI.tiles.addTile(new_url, new_title);
    }

    this.closeDialog();
  }

  removeTile() {
    BrowserAPI.tiles.removeTile(this.state.values.old_url);
    this.closeDialog();
  }

  render() {
    const fields = (
      <React.Fragment>
        <ThemedInput
          id="title"
          title="Name"
          value={this.state.values.name}
          focused={true}
          autocorrect={true}
          onChange={(value) => this.onChange('name', value)}
        />
        <ThemedInput
          id="url"
          title="URL"
          value={this.state.values.url}
          focused={false}
          autocorrect={false}
          onChange={(value) => this.onChange('url', value)}
        />
      </React.Fragment>
    );

    const buttons = (
      <ThemedButtonGroup>
        <ThemedButton
          id="remove"
          text="Remove"
          type="button"
          primary={true}
          variant={'outlined'}
          disabled={this.state.isRemoveDisabled}
          onClick={() => this.removeTile()}
        />

        <ThemedButtonGroup align="right">
          <ThemedButton
            id="cancel"
            text="Cancel"
            type="button"
            primary={true}
            onClick={() => this.closeDialog()}
            variant={'outlined'}
          />
          <ThemedButton
            id="done"
            text="Done"
            type="submit"
            primary={true}
            disabled={this.state.isSubmitDisabled}
          />
        </ThemedButtonGroup>
      </ThemedButtonGroup>
    );

    return (
      <ThemedForm
        formId={'ShortcutPanel'}
        title={`${this.props.isEdit ? 'Edit' : 'Add'} shortcut`}
        onSubmit={() => this.onSubmit()}
        onDismiss={() => this.closeDialog()}
        panels={[
          {
            title: `${this.props.isEdit ? 'Edit' : 'Add'} shortcut`,
            icon: null,
            body: fields,
          },
        ]}
        buttons={buttons}
      />
    );
  }
}

export default ShortcutPanel;
