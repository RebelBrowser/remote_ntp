import React from 'react';

import './Search.css';
import Strings from './Strings.js';
import { buildFaviconUrl } from './../Util';

const BrowserAPI = require('browser-api');

class Search extends React.Component {
  constructor(props) {
    super(props);

    // This object is used to track the text the user input themselves and any
    // inline autocomplete match text from the browser. For example, the user
    // may enter "what is", and the full autocomplete match may be "what is my
    // user agent". In that case, |input| will be "what is" and |inline| will be
    // " my user agent".
    //
    // This object is mainly used to automatically select that inline text so
    // that as the user keeps typing, the autocomplete text is overwritten.
    // Ideally, these values could be included in or derived from the component
    // state, but unfortunately we cannot update text selection at render time;
    // we can only update an <input> element's selection properties after it has
    // rendered (via |updateSearchInputForSelectedMatch|).
    this.lastInput = {
      input: '',
      inline: '',
    };

    // Also keep track of the last query issued via the browser API. This is
    // used to detect stale autocomplete results that occur when the user types
    // very quickly.
    this.lastQuery = '';

    this.enterWasPressedEvent = null;
    this.deleteWasPressed = false;

    // Stores the autocomplete result fields from the browser.
    this.state = {
      input: '',
      matches: [],
    };
  }

  componentDidMount() {
    BrowserAPI.autocomplete.addObserver((result) =>
      this.onAutocompleteResultChanged(result)
    );
  }

  navigateToMatch(index, match, e) {
    // trackSearchQuerySubmitted(this.lastInput.input, match.contents, index);
    BrowserAPI.autocomplete.openMatch(
      index,
      match.destinationUrl,
      e.button === 1, // Middle mouse button
      e.altKey,
      e.ctrlKey,
      e.metaKey,
      e.shiftKey
    );
  }

  queryAutocomplete(value) {
    this.lastQuery = value;

    // Inline autocomplete is disabled if the user deleted some text. It would
    // be very annoying to delete the current inline selection just to have it
    // immediately reappear on the next result.
    const caretNotAtEnd = this.refs.search.selectionStart !== value.length;
    const preventInlineAutocomplete = this.deleteWasPressed || caretNotAtEnd;

    BrowserAPI.autocomplete.query(value, preventInlineAutocomplete);
  }

  clearAutocompleteMatches() {
    BrowserAPI.autocomplete.stop();

    this.lastQuery = '';

    this.lastInput = {
      input: '',
      inline: '',
    };

    this.setState({
      input: '',
      matches: [],
    });
  }

  onAutocompleteResultChanged(result) {
    // Ignore stale results.
    if (this.lastQuery && this.lastQuery.trimLeft() !== result.input) {
      return;
    }

    const matches = result.matches;

    // Initialize the selected match to the first match, if allowed.
    matches.forEach((match, index) => {
      match.selected = match.allowedToBeDefaultMatch && index === 0;
    });

    this.setState(
      {
        input: result.input,
        matches: matches,
      },
      () => this.updateSearchInputForSelectedMatch(false)
    );
  }

  onSearchInputChanged(e) {
    const value = e.target.value;
    this.updateSearchInput(value);

    if (value.trim()) {
      this.queryAutocomplete(value);
    } else if (this.state.matches.length > 0) {
      this.clearAutocompleteMatches();
    }
  }

  onSearchFocusChanged(focused, e) {
    if (this.state.matches.length > 0) {
      if (!this.refs.search_wrapper.contains(e.relatedTarget)) {
        this.refs.search_wrapper.classList.toggle('show-matches', focused);
      }
    }
  }

  onSearchKeyDown(e) {
    const selectionStart = this.refs.search.selectionStart;
    const selectionEnd = this.refs.search.selectionEnd;

    // If the current state matches the user's input + the inline autocompletion
    // and the user types the next key in the inline autocompletion, just move
    // the selection and requery autocomplete. This prevents an ugly flicker
    // that would otherwise occur while the input is updated. However, skip this
    // logic when a modifier key is pressed, so we don't override OS behavior
    // (cmd+A should select all text, not type "a" if it's the next character).
    if (
      this.lastInput.inline &&
      !(e.altKey || e.ctrlKey || e.metaKey) &&
      selectionStart !== selectionEnd
    ) {
      const value = this.refs.search.value;
      const inline = value.substr(selectionStart, selectionEnd);

      if (
        inline === this.lastInput.inline &&
        value === this.lastInput.input + this.lastInput.inline &&
        inline[0].toLocaleLowerCase() === e.key.toLocaleLowerCase()
      ) {
        this.updateSearchInput(this.lastInput.input + e.key, inline.substr(1));
        this.queryAutocomplete(this.lastInput.input);

        e.preventDefault();
        return;
      }
    }

    if (!['ArrowDown', 'ArrowUp', 'Enter', 'Escape', 'Tab'].includes(e.key)) {
      return;
    }

    const selected = this.state.matches.findIndex((match) => match.selected);
    e.preventDefault();

    // When the Enter key is pressed, either navigate to the selected result, or
    // if not yet ready to navigate (i.e. the user typed and pressed Enter too
    // quickly), hold onto the event until matches arrive.
    if (e.key === 'Enter') {
      if (this.lastQuery === this.state.input) {
        const match = this.state.matches[selected];
        this.navigateToMatch(selected, match, e);
      } else {
        this.enterWasPressedEvent = e;
      }

      return;
    }

    // When the Escape key is pressed and the default match is selected, clear
    // the search field and matches. If a non-default match is selected, change
    // the selected match to the default match (below by setting |next| === 0).
    else if (e.key === 'Escape' && selected === 0) {
      this.updateSearchInput();
      this.clearAutocompleteMatches();
      return;
    }

    // Decide which match should now be selected, with wraparound.
    let next = 0;
    if (e.key === 'ArrowDown' || (e.key === 'Tab' && !e.shiftKey)) {
      next = selected + 1 < this.state.matches.length ? selected + 1 : 0;
    } else if (e.key === 'ArrowUp' || (e.key === 'Tab' && e.shiftKey)) {
      next = selected - 1 >= 0 ? selected - 1 : this.state.matches.length - 1;
    }

    const matches = this.state.matches;
    matches.forEach((match, index) => {
      match.selected = index === next;
    });

    this.setState(
      {
        matches: matches,
      },
      () => this.updateSearchInputForSelectedMatch(true)
    );
  }

  onMatchClick(index, match, e) {
    // Ignore already handled events and clicks that do not originate from the
    // primary (e.button === 0) or middle (e.button === 1) button.
    if (!e.isTrusted || e.defaultPrevented || e.button > 1) {
      return;
    }

    this.navigateToMatch(index, match, e);
    e.preventDefault();
  }

  updateSearchInputForSelectedMatch(forSelectionChange) {
    const selected = this.state.matches.findIndex((match) => match.selected);
    if (selected === -1) {
      return;
    }

    const match = this.state.matches[selected];

    if (this.enterWasPressedEvent !== null) {
      this.navigateToMatch(selected, match, this.enterWasPressedEvent);
      this.enterWasPressedEvent = null;
    }

    const inline = match.allowedToBeDefaultMatch
      ? match.inlineAutocompletion
      : '';
    const input = forSelectionChange
      ? match.fillIntoEdit.substr(0, match.fillIntoEdit.length - inline.length)
      : this.lastInput.input;

    this.updateSearchInput(input, inline);
  }

  updateSearchInput(input, inline) {
    input = input || '';
    inline = inline || '';

    if (this.lastInput.input === input && this.lastInput.inline === inline) {
      return;
    }

    const oldValue = this.lastInput.input + this.lastInput.inline;
    const newValue = input + inline;

    const oldSelectionStart = this.refs.search.selectionStart;
    const oldSelectionEnd = this.refs.search.selectionEnd;

    const oldValueWithoutSelection =
      oldSelectionStart === oldSelectionEnd ? oldValue : this.lastInput.input;
    const caretNotAtEnd = oldSelectionStart !== oldValueWithoutSelection.length;

    // Set value before updating selection, otherwise selection is removed.
    this.refs.search.value = newValue;

    if (caretNotAtEnd) {
      this.refs.search.selectionStart = oldSelectionStart;
      this.refs.search.selectionEnd = oldSelectionStart;
    } else if (inline) {
      this.refs.search.selectionStart = input.length;
      this.refs.search.selectionEnd = newValue.length;
    } else {
      this.refs.search.selectionStart = input.length + 1;
      this.refs.search.selectionEnd = input.length + 1;
    }

    this.deleteWasPressed =
      oldValue.length > newValue.length && oldValue.startsWith(newValue);

    this.lastInput = {
      input: input,
      inline: inline,
    };
  }

  renderSearchIcon(id, match) {
    let className = 'search-icon';

    if (!match) {
      const selected = this.state.matches.findIndex((match) => match.selected);
      match = selected === -1 ? null : this.state.matches[selected];
    }

    if (match) {
      if (!match.isSearchType) {
        const favicon = buildFaviconUrl(match.destinationUrl, false);
        return <img id={id} className="url-icon" src={favicon} alt="" />;
      }

      const searchHistoryMatchTypes = [
        'search-history',
        'search-suggest-personalized',
      ];

      if (searchHistoryMatchTypes.includes(match.type)) {
        className = 'clock-icon';
      } else if (match.type === 'search-calculator-answer') {
        className = 'calculator-icon';
      }
    }

    return <div id={id} className={className}></div>;
  }

  renderAutocompleteMatches() {
    return (
      <div id="search-matches" role="listbox">
        {this.state.matches.map((match, index) =>
          this.renderAutocompleteMatch(match, index)
        )}
      </div>
    );
  }

  // Rendering an autocomplete match has three main parts: the leading icon,
  // the match contents, and an optional match description. The leading icon is
  // set depending on the match type (search, history, etc.). The contents and
  // description are classified by a vector of CSS classes; see documentation
  // in components/omnibox/browser/autocomplete_match.h for details.
  renderAutocompleteMatch(match, index) {
    const contents = this.renderAutocompleteMatchClassifications(
      match.contents,
      match.contentsClass
    );
    const description = this.renderAutocompleteMatchClassifications(
      match.description,
      match.descriptionClass
    );

    const separator = match.type === 'search-calculator-answer' ? ' = ' : ' - ';
    const separators = description.length > 0 ? [separator] : [];

    const layout = [contents, separators, description];

    return (
      <a
        key={index}
        id={`match-${index}`}
        className={match.selected ? 'selected' : null}
        href={match.destinationUrl}
        onMouseDown={(e) => this.onMatchClick(index, match, e)}
        onAuxClick={(e) => this.onMatchClick(index, match, e)}
        onTouchStart={(e) => this.onMatchClick(index, match, e)}
        //
        // If the touch events are fired, prevent the mouse events from firing.
        // We call |preventDefault| from |onTouchStart|, but apparently that
        // does not work with React on Chromium in this specific case:
        // https://github.com/facebook/react/issues/9809
        onTouchEnd={(e) => e.preventDefault()}
      >
        {this.renderSearchIcon(`icon-${index}`, match)}

        {layout.map((group, outer_index) =>
          group.map((element, inner_index) => (
            <React.Fragment key={outer_index * group.length + inner_index}>
              {element}
            </React.Fragment>
          ))
        )}
      </a>
    );
  }

  renderAutocompleteMatchClassifications(text, classifications) {
    // Equivalent to ACMatchClassification::Style.
    const styles = {
      NONE: 0,
      URL: 1 << 0,
      MATCH: 1 << 1,
      DIM: 1 << 2,
    };

    return classifications.map((classification, i) => {
      const next = classifications[i + 1] || { offset: text.length };
      const classifiedText = text.substring(classification.offset, next.offset);

      const classes = [];
      if (classification.style & styles.DIM) {
        classes.push('dim');
      }
      if (classification.style & styles.MATCH) {
        classes.push('match');
      }
      if (classification.style & styles.URL) {
        classes.push('url');
      }

      return <span className={classes.join(' ')}>{classifiedText}</span>;
    });
  }

  render = () => (
    <div id="search-container" data-testid="Search">
      <div
        id="search-input-wrapper"
        ref="search_wrapper"
        className={this.state.matches.length > 0 ? 'show-matches' : null}
        onKeyDown={(e) => this.onSearchKeyDown(e)}
      >
        {this.renderSearchIcon('search-icon')}

        <input
          id="search"
          ref="search"
          type="search"
          autoComplete="off"
          spellCheck="false"
          aria-live="polite"
          placeholder={Strings.placeholder}
          onChange={(e) => this.onSearchInputChanged(e)}
          onFocus={(e) => this.onSearchFocusChanged(true, e)}
          onBlur={(e) => this.onSearchFocusChanged(false, e)}
        />

        {this.renderAutocompleteMatches()}
      </div>
    </div>
  );
}

export default Search;
