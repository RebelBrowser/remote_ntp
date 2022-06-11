import LocalizedStrings from 'react-localization';

let strings = {
  en: {
    placeholder: 'Search or enter an address',
  },

  'es-MX': {
    placeholder: 'Buscar o escribir URL',
  },
};

// Setup aliased locales for all country code formats used by the browser.
['es', 'es_MX', 'es-419', 'es_419'].forEach((code) => {
  strings[code] = strings['es-MX'];
});

const localized = new LocalizedStrings(strings, { logsEnabled: false });
export default localized;
