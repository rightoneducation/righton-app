import { createTheme } from '@mui/material/styles';

// design tokens - colors: (comments = example usage)
const primaryColor = '#FFFFFF'; // main background
const backgroundGradient =
  'linear-gradient(to right, rgba(62, 0, 172, 1), rgba(98, 0, 204, 1))'; // upper header background
const highlightGradient = 'linear-gradient(90deg, #159EFA 0%, #19BCFB 100%)'; // button and score indicator
const altHighlightGradient =
  'linear-gradient(190deg, #7BDD61 0%, #22B851 100%)'; // new points score indicator
const secondaryColor = '#8E2E9D'; // placeholder for dark mode
const primaryTextColor = '#FFFFFF'; // main text (headers, titles)
const secondaryTextColor = '#384466'; // secondary text (question text, answer text)
const playerNameTextColor = '#AEAEAE'; // player name
const greenColor = '#22AE48'; // answer card title highlight (correct answer phase)
const redColor = '#FF0000'; // answer card title highlight (trickiest answer phase)
const blueColor = '#22ADFF'; // highlights around selected answer, pagination bullet
const extraDarkGreyColor = '#909090'; // disabled button
const darkGreyColor = '#CFCFCF'; // disabled pagination bullet, unselected answer
const lightGreyColor = '#F4F4F4'; // submitted answer
const greenCorrectColor = '#EBFFDA'; // correct answer background

// design tokens - breakpoints:
const xs = 0;
const sm = 700;
const md = 900;
const lg = 1200;
const xl = 1536;

// design tokes - header, footer sizes (coordinate this approach with U/X team):
const headerHeight = '68px';
const footerHeight = '60px';

// adds mainGradient field to the palette theme
declare module '@mui/material/styles' {
  interface Theme {
    sizing: {
      headerHeight: string;
      footerHeight: string;
    };
  }

  interface ThemeOptions {
    sizing?: {
      headerHeight?: string;
      footerHeight?: string;
    };
  }

  interface PaletteColor {
    backgroundGradient: string;
    highlightGradient: string;
    altHighlightGradient: string;
    red: string;
    green: string;
    blue: string;
    extraDarkGrey: string;
    darkGrey: string;
    lightGrey: string;
    correctColor: string;
  }

  interface SimplePaletteColorOptions {
    backgroundGradient?: string;
    highlightGradient?: string;
    altHighlightGradient?: string;
    red?: string;
    green?: string;
    blue?: string;
    extraDarkGrey?: string;
    darkGrey?: string;
    lightGrey?: string;
    correctGreen?: string;
  }
}

export default createTheme({
  breakpoints: {
    values: { xs, sm, md, lg, xl },
  },
  sizing: {
    headerHeight,
    footerHeight,
  },
  palette: {
    primary: {
      main: primaryColor,
      backgroundGradient,
      highlightGradient,
      altHighlightGradient,
      red: redColor,
      green: greenColor,
      blue: blueColor,
      extraDarkGrey: extraDarkGreyColor,
      darkGrey: darkGreyColor,
      lightGrey: lightGreyColor,
      correctGreen: greenCorrectColor,
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
      lineHeight: '18px',
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
