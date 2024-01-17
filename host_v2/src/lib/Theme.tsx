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
const radialGradient =
  'radial-gradient(circle 500px at 50% 60%, #7D64C7 13.54%, #514187 51.56%, #3A2D66 77.6%, #352960 88.02%, #312759 100%)';
const highlightGradient = 'linear-gradient(90deg, #159EFA 0%, #19BCFB 100%)'; // button and score indicator
const altHighlightGradient =
  'linear-gradient(190deg, #7BDD61 0%, #22B851 100%)'; // new points score indicator
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
const countdownColor = 'rgba(225, 65, 107'; // countdown timer color - appended with '0.x )' opacity when used in countdown
const graphTickLabelColorLight = 'rgba(255, 255, 255, 0.25)'; // color of labels on player responses cards if no responses
const playerFeedbackLabelColor = 'rgba(255, 255, 255, 0.4)'; // color of text on confidence card, responses card, player thinking, etc.
const graphTickLabelColorDark = 'rgba(255, 255, 255, 0.5)'; // color of labels on player responses cards if at least one response
const feedbackCardsInstructionsColor = 'rgba(255, 255, 255, 0.6)'; // color of text on player data cards that says 'tap on a response...'
const graphAccentColor = 'rgba(255, 255, 255, 0.2)'; // color of graph axis and bar outline on confidence card, responses card, etc.
const dropdownInfoBackgroundColor = '#063772'; // background color of the sub-cards in the player response dropdowns 
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

// design tokens - breakpoints:
const xs = 0;
const sm = 400;
const md = 700;
const lg = 1024;
const xl = 1536;

// design tokens - header, footer, padding sizes (coordinate this approach with U/X team): (comments = example usage)
const fullHeaderHeight = 228;
const headerHeight = 150;
const footerHeight = 60;
const pregameMinColumnWidth = 248; // used on enter game code screen and righton logo
const answerOptionBorderRadius = 22; // border radius of options on answer cards
const extraSmallPadding = 8; // small icons, text positioning
const smallPadding = 16; // upper and lower margins on text, spacing of content in cards
const mediumPadding = 24; // timer margin
const largePadding = 32; // text spacing on answer selector, top margin on titles
const extraLargePadding = 48; // spacing between card and edge of screen
const extraExtraLargePadding = 64; // spacing between buttons and bottom of screen
// (sizing for victory bar graphs)
const barStrokeWidthThin = 1 // stroke width of the horizontal response bar graphs 
const barStrokeWidth = 2; // stroke width of the bar outlines on host graph cards
const confidenceBarThickness = 55; // thickness of each bar component in confidence bar graph
const responseBarThickness = 18; // thickness of each bar in horizontally aligned response graphs
const barHighlightPadding = 12; // extra space around bar occupied by highlight on response graphs
const defaultVictoryPadding = 50; // victory toolkit's default padding 
const countLabelPadding = 3; // padding for response counts label on the interior of each horizontal bar 
const responseAxisPadding = 42; // padding on the left of the horizontal response graphs
const responseGraphVerticalScale = 40; // the constant we multiply by the number of answer choices, determines height of response graphs

// adds mainGradient field to the palette theme
declare module '@mui/material/styles' {
  interface Theme {
    sizing: {
      fullHeaderHeight: number;
      headerHeight: number;
      footerHeight: number;
      pregameMinColumnWidth: number;
      answerOptionBorderRadius: number;
      extraSmallPadding: number;
      smallPadding: number;
      mediumPadding: number;
      largePadding: number;
      extraLargePadding: number;
      extraExtraLargePadding: number;
      barStrokeWidthThin: number;
      barStrokeWidth: number;
      confidenceBarThickness: number;
      responseBarThickness: number;
      barHighlightPadding: number;
      defaultVictoryPadding: number;
      countLabelPadding: number;
      responseAxisPadding: number;
      responseGraphVerticalScale: number;
    };
  }

  interface ThemeOptions {
    sizing?: {
      fullHeaderHeight?: number;
      headerHeight?: number;
      footerHeight?: number;
      pregameMinColumnWidth?: number;
      answerOptionBorderRadius?: number;
      extraSmallPadding?: number;
      smallPadding?: number;
      mediumPadding?: number;
      largePadding?: number;
      extraLargePadding?: number;
      extraExtraLargePadding?: number;
      barStrokeWidthThin?: number;
      barStrokeWidth?: number;
      confidenceBarThickness?: number;
      responseBarThickness?: number;
      barHighlightPadding?: number;
      defaultVictoryPadding?: number;
      countLabelPadding?: number;
      responseAxisPadding?: number;
      responseGraphVerticalScale?: number;
    };
  }

  interface PaletteColor {
    accent: string;
    backgroundGradient: string;
    darkBlueCardColor: string;
    radialGradient: string;
    highlightGradient: string;
    altHighlightGradient: string;
    red: string;
    green: string;
    darkPurple: string;
    blue: string;
    darkBlue: string;
    extraDarkGrey: string;
    darkGrey: string;
    lightGrey: string;
    correctColor: string;
    graphTickLabelColorLight: string;
    playerFeedbackLabelColor: string;
    graphTickLabelColorDark: string;
    feedbackCardsInstructionsColor: string;
    graphAccentColor: string;
    dropdownInfoBackgroundColor: string;
    countdownColor: string;
    radialTimerArray: string[];
  }

  interface SimplePaletteColorOptions {
    accent?: string;
    backgroundGradient?: string;
    darkBlueCardColor?: string;
    radialGradient?: string;
    highlightGradient?: string;
    altHighlightGradient?: string;
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
    graphTickLabelColorLight?: string;
    playerFeedbackLabelColor?: string;
    graphTickLabelColorDark?: string;
    feedbackCardsInstructionsColor?: string;
    graphAccentColor?: string;
    dropdownInfoBackgroundColor?: string;
    countdownColor: string;
    radialTimerArray?: string[];
  }
}

export default createTheme({
  breakpoints: {
    values: { xs, sm, md, lg, xl },
  },
  sizing: {
    fullHeaderHeight,
    headerHeight,
    footerHeight,
    pregameMinColumnWidth,
    answerOptionBorderRadius,
    extraSmallPadding,
    smallPadding,
    mediumPadding,
    largePadding,
    extraLargePadding,
    extraExtraLargePadding,
    barStrokeWidthThin,
    barStrokeWidth,
    confidenceBarThickness,
    responseBarThickness,
    barHighlightPadding,
    defaultVictoryPadding,
    countLabelPadding,
    responseAxisPadding,
    responseGraphVerticalScale
  },
  palette: {
    primary: {
      main: mainColor,
      accent: accentColor,
      darkBlueCardColor,
      backgroundGradient,
      radialGradient,
      highlightGradient,
      altHighlightGradient,
      red: redColor,
      green: greenColor,
      darkPurple: darkPurpleColor,
      blue: blueColor,
      darkBlue: secondaryTextColor,
      extraDarkGrey: extraDarkGreyColor,
      darkGrey: darkGreyColor,
      lightGrey: lightGreyColor,
      correctColor: greenCorrectColor,
      graphTickLabelColorLight,
      playerFeedbackLabelColor,
      graphTickLabelColorDark,
      feedbackCardsInstructionsColor,
      graphAccentColor,
      dropdownInfoBackgroundColor,
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
  },
});