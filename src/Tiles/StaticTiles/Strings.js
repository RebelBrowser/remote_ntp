import LocalizedStrings from 'react-localization';

let strings = {
  en: {
    settings: 'Settings',
    history: 'History',
    speed_test: 'Speed Test',
  },
};

// Setup aliased locales for all country code formats used by the browser.
// N.B. Uncomment this when we have es-MX localizations for this module.
// ['es', 'es_MX', 'es-419', 'es_419'].forEach((code) => {
//   strings[code] = strings['es-MX'];
// });

const localized = new LocalizedStrings(strings, { logsEnabled: false });
export default localized;