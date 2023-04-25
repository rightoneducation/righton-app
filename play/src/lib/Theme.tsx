import { createTheme } from '@mui/material/styles';

// design tokens - colors: (comments = example usage)
const mainColor = '#FFFFFF'; // main  (ex white)
const accentColor = '#312759'; // accent (ex purple)
const backgroundGradient =
  'linear-gradient(to right, rgba(62, 0, 172, 1), rgba(98, 0, 204, 1))'; // upper header background
// const radialGradient =
// 'radial-gradient(circle farthest-side, #7D63C8, #7D63C8 100%)';
const radialGradient =
  'radial-gradient(circle 500px at 50% 60%, #7D64C7 13.54%, #514187 51.56%, #3A2D66 77.6%, #352960 88.02%, #312759 100%)';
const highlightGradient = 'linear-gradient(90deg, #159EFA 0%, #19BCFB 100%)'; // button and score indicator
const altHighlightGradient =
  'linear-gradient(190deg, #7BDD61 0%, #22B851 100%)'; // new points score indicator
const secondaryColor = '#8E2E9D'; // placeholder for dark mode
const primaryTextColor = '#FFFFFF'; // main text (headers, titles)
const secondaryTextColor = '#384466'; // secondary text (question text, answer text)
const playerNameTextColor = '#AEAEAE'; // player name
const darkPurpleColor = '#6515C9'; // phase results, selected answer
const greenColor = '#22AE48'; // answer card title highlight (correct answer phase)
const redColor = '#FF0000'; // answer card title highlight (trickiest answer phase)
const blueColor = '#22ADFF'; // highlights around selected answer, pagination bullet
const extraDarkGreyColor = '#909090'; // disabled button
const darkGreyColor = '#CFCFCF'; // disabled pagination bullet, unselected answer
const lightGreyColor = '#F4F4F4'; // submitted answer
const greenCorrectColor = '#EBFFDA'; // correct answer background

// design tokens - breakpoints:
const xs = 400;
const sm = 700;
const md = 900;
const lg = 1200;
const xl = 1536;

// design tokens - header, footer, padding sizes (coordinate this approach with U/X team): (comments = example usage)
const headerHeight = 68;
const footerHeight = 60;
const extraSmallPadding = 8; // small icons, text positioning
const smallPadding = 16; // upper and lower margins on text, spacing of content in cards
const mediumPadding = 24; // timer margin
const largePadding = 32; // text spacing on answer selector, top margin on titles
const extraLargePadding = 48; // spacing between card and edge of screen

// adds mainGradient field to the palette theme
declare module '@mui/material/styles' {
  interface Theme {
    sizing: {
      headerHeight: number;
      footerHeight: number;
      extraSmallPadding: number;
      smallPadding: number;
      mediumPadding: number;
      largePadding: number;
      extraLargePadding: number;
    };
  }

  interface ThemeOptions {
    sizing?: {
      headerHeight?: number;
      footerHeight?: number;
      extraSmallPadding?: number;
      smallPadding?: number;
      mediumPadding?: number;
      largePadding?: number;
      extraLargePadding?: number;
    };
  }

  interface PaletteColor {
    accent: string;
    backgroundGradient: string;
    radialGradient: string;
    highlightGradient: string;
    altHighlightGradient: string;
    red: string;
    green: string;
    darkPurple: string;
    blue: string;
    extraDarkGrey: string;
    darkGrey: string;
    lightGrey: string;
    correctColor: string;
  }

  interface SimplePaletteColorOptions {
    accent?: string;
    backgroundGradient?: string;
    radialGradient?: string;
    highlightGradient?: string;
    altHighlightGradient?: string;
    red?: string;
    green?: string;
    darkPurple?: string;
    blue?: string;
    purple?: string;
    extraDarkGrey?: string;
    darkGrey?: string;
    lightGrey?: string;
    correctColor?: string;
  }
}

export default createTheme({
  breakpoints: {
    values: { xs, sm, md, lg, xl },
  },
  sizing: {
    headerHeight,
    footerHeight,
    extraSmallPadding,
    smallPadding,
    mediumPadding,
    largePadding,
    extraLargePadding,
  },
  palette: {
    primary: {
      main: mainColor,
      accent: accentColor,
      backgroundGradient,
      radialGradient,
      highlightGradient,
      altHighlightGradient,
      red: redColor,
      green: greenColor,
      darkPurple: darkPurpleColor,
      blue: blueColor,
      extraDarkGrey: extraDarkGreyColor,
      darkGrey: darkGreyColor,
      lightGrey: lightGreyColor,
      correctColor: greenCorrectColor,
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
