import { createTheme } from '@mui/material/styles';

// design tokens - colors::
const primaryColor = '#FFFFFF';
const primaryGradient =
  'linear-gradient(to right, rgba(62, 0, 172, 1), rgba(98, 0, 204, 1))';
const secondaryColor = '#8E2E9D';
const primaryTextColor = '#FFFFFF';
const secondaryTextColor = '#384466';
const playerNameTextColor = '#AEAEAE';
const greenTextColor = '#22AE48';
const redTextColor = '#FF0000';

// design tokens - breakpoints:
const xs = 0;
const sm = 700;
const md = 900;
const lg = 1200;
const xl = 1536;

// adds mainGradient field to the palette theme
declare module '@mui/material/styles' {
  interface PaletteColor {
    mainGradient: string;
    redText: string;
    greenText: string;
  }

  interface SimplePaletteColorOptions {
    mainGradient?: string;
    redText?: string;
    greenText?: string;
  }
}

export default createTheme({
  breakpoints: {
    values: { xs, sm, md, lg, xl },
  },
  palette: {
    primary: {
      main: primaryColor,
      mainGradient: primaryGradient,
      redText: redTextColor,
      greenText: greenTextColor,
    },
    secondary: {
      main: secondaryColor,
    },
  },
  typography: {
    fontFamily: 'Karla',
    h1: {
      // screen titles
      fontWeight: '800',
      fontSize: '26px',
      lineHeight: '30px',
      color: primaryTextColor,
    },
    h2: {
      // column titles
      fontWeight: '800',
      fontSize: '20px',
      lineHeight: '30px',
      color: primaryTextColor,
    },
    h3: {
      // player name
      fontWeight: '800',
      fontSize: '20px',
      lineHeight: '30px',
      color: playerNameTextColor,
    },
    h4: {
      // answer card title
      fontWeight: '700',
      fontSize: '14px',
      lineHeight: '16px',
      color: secondaryTextColor,
    },
    h5: {
      // card answer list letters (A, B, C, D, etc)
      fontFamily: 'Karla',
      fontSize: '16px',
      fontWeight: 800,
      lineHeight: '19px',
      color: secondaryTextColor,
    },
    body1: {
      // question text
      fontWeight: '400',
      fontSize: '16px',
      lineHeight: '19px',
      color: secondaryTextColor,
    },
    body2: {
      // answer text
      fontWeight: '400',
      fontSize: '18px',
      lineHeight: '22px',
      textAlign: 'left',
      color: secondaryTextColor,
    },
    button: {
      // button text
      fontWeight: '700',
      fontSize: '16px',
      lineHeight: '18px',
      color: primaryTextColor,
    },
    caption: {
      // timer text
      fontWeight: '700',
      fontSize: '12px',
      lineHeight: '14px',
      color: primaryTextColor,
      opacity: '0.8',
    },
    overline: {
      // scoreIndicator text
      fontSize: '18px',
      fontWeight: 800,
      lineHeight: '21px',
      color: primaryTextColor,
      textShadow: '0px 1px 1px rgba(0, 0, 0, 0.15)',
    },
  },
});
