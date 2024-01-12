import { createTheme } from '@mui/material/styles';

// design tokens - colors: (comments = example usage)
const mainColor = '#FFFFFF'; // main  (ex white)
const accentColor = '#312759'; // accent (ex purple)
const darkBlueCardColor = '#08458F'; // card color for default host cards with student data
const backgroundGradient =
  'linear-gradient(196deg, rgb(49,109,176) 0%, rgb(11,33,90) 73%)'; // upper header background1
//   background: linear-gradient(196deg, #0D68B1 0%, #02215F 73.62%);
// box-shadow: 0px 2.5px 23px 0px rgba(0, 141, 239, 0.30);
// const radialGradient =
// 'radial-gradient(circle farthest-side, #7D63C8, #7D63C8 100%)';
const timerGradient =
'linear-gradient(90deg, #168CDC 0%, #00A7E8 100%)';
const radialGradient =
  'radial-gradient(circle 500px at 50% 60%, #7D64C7 13.54%, #514187 51.56%, #3A2D66 77.6%, #352960 88.02%, #312759 100%)';
const highlightGradient = 'linear-gradient(90deg, #159EFA 0%, #19BCFB 100%)'; // button and score indicator
const altHighlightGradient =
  'linear-gradient(190deg, #7BDD61 0%, #22B851 100%)'; // new points score indicator
const questionGradient =
  'linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 50%, rgba(255,255,255,0) 50%, rgba(255,255,255,0) 100%)'; //  current question indicator
const primaryTextColor = '#FFFFFF'; // main text (headers, titles)
const secondaryTextColor = '#384466'; // secondary text (question text, answer text)
const darkestTextColor = '#000000'; // darkest color for text(ex black)
const playerNameTextColor = '#AEAEAE'; // player name
const darkPurpleColor = '#4700B2'; // phase results, selected answer
const greenColor = '#22AE48'; // answer card title highlight (correct answer phase)
const redColor = '#FF0000'; // answer card title highlight (trickiest answer phase)
const blueColor = '#22ADFF'; // highlights around selected answer, pagination bullet
const extraDarkGreyColor = '#909090'; // disabled button
const darkGreyColor = '#CFCFCF'; // disabled pagination bullet, unselected answer
const lightGreyColor = '#F4F4F4'; // submitted answer
const greenCorrectColor = '#EBFFDA'; // correct answer background
const baseQuestionColor = 'rgba(255,255,255,0.2)'; //
const countdownColor = 'rgba(225, 65, 107'; // countdown timer color - appended with '0.x )' opacity when used in countdown
const radialTimerArray = [
  `${countdownColor}, 0.3)`,
  `${countdownColor}, 0.4)`,
  `${countdownColor}, 0.5)`,
  `${countdownColor}, 0.6)`,
  `${countdownColor}, 0.7)`,
  `${countdownColor}, 0.8)`,
  `${countdownColor}, 0.9)`,
  `${countdownColor}, 1)`,
]; // radial timer color array - appended with '0.x )' opacity when used in countdown

//  borders
const borderWidth = 1;
const solidWhite = `${borderWidth}px solid rgba(255, 255, 255, 1)`;
const transparent = `${borderWidth}px solid rgba(255, 255, 255, 0)`;
const semiTransparent = `${borderWidth}px solid rgba(255, 255, 255, 0.2)`;


// design tokens - breakpoints:
const xs = 400;
const sm = 700;
const md = 900;
const lg = 1200;
const xl = 1536;

// design tokens - header, footer, padding sizes (coordinate this approach with U/X team): (comments = example usage)
const fullHeaderHeight = 228;
const headerHeight = 150;
const footerHeight = 60;
const pregameMinColumnWidth = 248; // used on enter game code screen and righton logo
const extraExtraSmallPadding = 4; //  used on question indicators
const extraSmallPadding = 8; // small icons, text positioning
const smallPadding = 16; // upper and lower margins on text, spacing of content in cards
const mediumPadding = 24; // timer margin
const largePadding = 32; // text spacing on answer selector, top margin on titles
const extraLargePadding = 48; // spacing between card and edge of screen
const extraExtraLargePadding = 64; // spacing between buttons and bottom of screen

// adds mainGradient field to the palette theme
declare module '@mui/material/styles' {
  interface Theme {
    borders: {
      borderWidth: number;
      solidWhite: string;
      transparent: string;
      semiTransparent: string;
    };
    sizing: {
      fullHeaderHeight: number;
      headerHeight: number;
      footerHeight: number;
      pregameMinColumnWidth: number;
      extraExtraSmallPadding: number;
      extraSmallPadding: number;
      smallPadding: number;
      mediumPadding: number;
      largePadding: number;
      extraLargePadding: number;
      extraExtraLargePadding: number;
    };
  }

  interface ThemeOptions {
    borders?: {
      borderWidth?: number;
      solidWhite?: string;
      transparent?: string;
      semiTransparent?: string;
    };
    sizing?: {
      fullHeaderHeight?: number;
      headerHeight?: number;
      footerHeight?: number;
      pregameMinColumnWidth?: number;
      extraExtraSmallPadding?: number;
      extraSmallPadding?: number;
      smallPadding?: number;
      mediumPadding?: number;
      largePadding?: number;
      extraLargePadding?: number;
      extraExtraLargePadding?: number;
    };
  }

  interface PaletteColor {
    accent: string;
    backgroundGradient: string;
    darkBlueCardColor: string;
    timerGradient: string;
    radialGradient: string;
    highlightGradient: string;
    altHighlightGradient: string;
    questionGradient: string;
    red: string;
    green: string;
    darkPurple: string;
    blue: string;
    darkBlue: string;
    extraDarkGrey: string;
    darkGrey: string;
    lightGrey: string;
    correctColor: string;
    countdownColor: string;
    radialTimerArray: string[];
  }

  interface SimplePaletteColorOptions {
    accent?: string;
    backgroundGradient?: string;
    darkBlueCardColor?: string;
    timerGradient?: string;
    radialGradient?: string;
    highlightGradient?: string;
    altHighlightGradient?: string;
    questionGradient?: string;
    red?: string;
    green?: string;
    darkPurple?: string;
    blue?: string;
    darkBlue?: string;
    purple?: string;
    extraDarkGrey?: string;
    darkGrey?: string;
    lightGrey?: string;
    correctColor?: string;
    baseQuestionColor?: string;
    countdownColor: string;
    radialTimerArray?: string[];
  }
}

export default createTheme({
  breakpoints: {
    values: { xs, sm, md, lg, xl },
  },
  borders: {
    borderWidth,
    solidWhite,
    transparent,
    semiTransparent,
  },
  sizing: {
    fullHeaderHeight,
    headerHeight,
    footerHeight,
    pregameMinColumnWidth,
    extraExtraSmallPadding,
    extraSmallPadding,
    smallPadding,
    mediumPadding,
    largePadding,
    extraLargePadding,
    extraExtraLargePadding,
  },
  palette: {
    primary: {
      main: mainColor,
      accent: accentColor,
      darkBlueCardColor,
      backgroundGradient,
      radialGradient,
      timerGradient,
      highlightGradient,
      altHighlightGradient,
      questionGradient,
      red: redColor,
      green: greenColor,
      darkPurple: darkPurpleColor,
      blue: blueColor,
      darkBlue: secondaryTextColor,
      extraDarkGrey: extraDarkGreyColor,
      darkGrey: darkGreyColor,
      lightGrey: lightGreyColor,
      correctColor: greenCorrectColor,
      baseQuestionColor,
      countdownColor,
      radialTimerArray,
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
    h6: {
      // screen titles
      fontWeight: '800',
      fontSize: '35px',
      lineHeight: '48px',
      color: primaryTextColor,
    },
    subtitle1: {
      // correct/nice try discuss answer text
      fontWeight: '800',
      fontSize: '24px',
      lineHeight: '38px',
      color: darkestTextColor,
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
    subtitle2: {
      //  player icon text
      fontFamily: 'Poppins',
      fontSize: '13px',
      fontWeight: 600,
      lineHeight: '22px',
      color: primaryTextColor,
    },
  },
});
