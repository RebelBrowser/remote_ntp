import UniNeueLight from './Fonts/UniNeueLight.ttf';
import UniNeueBold from './Fonts/UniNeueBold.ttf';
import UniNeueHeavy from './Fonts/UniNeueHeavy.ttf';

const UniNeueFont = {
  fontFamily: 'UniNeueLight',
  fontStyle: 'normal',
  fontDisplay: 'swap',
  fontWeight: 400,
  src: `
    local('UniNeueLight'),
    url(${UniNeueLight}) format('tff')
  `,
};

const UniNeueBoldFont = {
  fontFamily: 'UniNeueBold',
  fontStyle: 'normal',
  fontDisplay: 'swap',
  fontWeight: 400,
  src: `
    local('UniNeueBold'),
    url(${UniNeueBold}) format('tff')
  `,
};

const UniNeueHeavyFont = {
  fontFamily: 'UniNeueHeavy',
  fontStyle: 'normal',
  fontDisplay: 'swap',
  fontWeight: 400,
  src: `
    local('UniNeueHeavy'),
    url(${UniNeueHeavy}) format('tff')
  `,
};

const theme = {
  palette: {
    primary: {
      main: '#0aa5ab', // Make this the theme primary
    },
    secondary: {
      main: '#465967',
    },
    background: {
      main: '#202e39',
      ternary: '#1C2A33',
    },
    highlight: {
      main: '#8AB4F8',
    },
    hover: {
      foreground: '#73A0DF',
      background: 'rgba(200, 200, 200, 0.1)',
    },
  },
  browser: {
    darkModeEnabled: true,
    background: {
      imageUrl: '',
      imageAlignment: '',
      imageTiling: '',
      attributionLine1: '',
      attributionLine2: '',
      attributionUrl: '',
      attributionImageUrl: '',
    },
  },

  typography: {
    fontFamily: 'UniNeueFont, Source Sans Pro, sans-serif',
    // Form Title
    h1: {
      fontSize: 18,
      fontFamily: 'UniNeueHeavy',
      color: '#ffffff',
    },
    // Toggle Header
    h2: {
      fontSize: 18,
      fontFamily: 'UniNeueHeavy',
      color: '#ffffff',
      fontWeight: 500,
    },
    // Toggle Subheader
    h3: {
      fontSize: 13,
      fontFamily: 'UniNeueHeavy',
      color: '#0aa5ab',
      fontWeight: 500,
    },
    // Tile Title
    body1: {
      fontSize: 13,
      // Normal iphone size and smaller
      '@media  (max-width:375px) and (min-width:350px)': {
        fontSize: '12px',
      },
      // A little bigger than iphone 5 and smaller
      '@media (max-width:350px)': {
        fontSize: '11px',
      },
      fontFamily: 'Source Sans Pro',
      color: '#ffffff',
      fontWeight: 900,
    },
    // Customization Panel Tile Title
    body2: {
      fontSize: 15,
      fontFamily: 'Source Sans Pro',
      color: '#ffffff',
      fontWeight: 500,
    },
  },
  overrides: {
    MuiCssBaseline: {
      '@global': {
        '@font-face': [UniNeueFont, UniNeueBoldFont, UniNeueHeavyFont],
      },
    },
  },
};

export function useSetTheme() {
  const primaryColor = theme.palette.primary.main;
  theme.typography.h2.color = primaryColor;

  return theme;
}

export default theme;
