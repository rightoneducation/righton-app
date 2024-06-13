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
const timerGradient = 'linear-gradient(90deg, #168CDC 0%, #00A7E8 100%)';
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
const playerFeedbackLabelColor = 'rgba(255, 255, 255, 0.4)'; // color of text on confidence card, responses card, player thinking, etc.
const feedbackCardsInstructionsColor = 'rgba(255, 255, 255, 0.6)'; // color of text on player data cards that says 'tap on a response...'
const graphAccentColor = 'rgba(255, 255, 255, 0.2)'; // color of graph axis and bar outline on confidence card, responses card, etc.
const dropdownInfoBackgroundColor = '#063772'; // background color of the sub-cards in the player response dropdowns
const answerBarBackgroundColor = 'rgba(8, 69, 143, 0.20)';
const progressBarColor = '#08458F';
const progressBarBackgroundColor = '#D0DAE7';
const radialTimerArray = [
  'rgb(126, 90, 175)',
  'rgb(148, 98, 179)',
  'rgb(169, 104, 180)',
  'rgb(186, 107, 177)',
  'rgb(202, 109, 172)',
  'rgb(218, 112, 168)',
  'rgb(237, 115, 166)',
  'rgb(255, 120, 165)',
]; // radial timer color array - appended with '0.x )' opacity when used in countdown

//  borders
const borderWidth = 1;
const solidWhite = `${borderWidth}px solid rgba(255, 255, 255, 1)`;
const transparent = `${borderWidth}px solid rgba(255, 255, 255, 0)`;
const semiTransparent = `${borderWidth}px solid rgba(255, 255, 255, 0.2)`;

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
const answerBarHeight = 18;
const nextStateButtonWidth = 300;
const pregameMinColumnWidth = 248; // used on enter game code screen and righton logo
const answerOptionBorderRadius = 22; // border radius of options on answer cards
const xxSmPadding = 4; // positioning in Victory Graphs
const xSmPadding = 8; // small icons, text positioning
const smPadding = 16; // upper and lower margins on text, spacing of content in cards
const mdPadding = 24; // timer margin
const lgPadding = 32; // text spacing on answer selector, top margin on titles
const xLgPadding = 48; // spacing between card and edge of screen
const xxLgPadding = 64; // spacing between buttons and bottom of screen
const barStrokeWidth = 2; // stroke width of the bar outlines on host graph cards
const confidenceBarThickness = 55; // thickness of each bar component in confidence bar graph

// Victory Graphs Theming

// victory applies a default of 50px to the VictoryChart component
// we intentionally set this so that we can reference it programmatically throughout the chart
const defaultVictoryPadding = 50;

// Responses Graph
const barThicknessResponses = 18;
const barThicknessZeroResponses = 26;
const labelOffsetResponses = 3;

// victory theme object that we pass into the component to style the graph
// see: https://commerce.nearform.com/open-source/victory/guides/themes
const customVictoryTheme = {
  axis: {
    style: {
      axis: { stroke: 'rgba(255, 255, 255, 0.2)', strokeWidth: 2 },
      grid: { stroke: 'transparent' },
      tickLabels: {
        padding: smPadding,
      },
    },
  },
  dependentAxis: {
    style: {
      axis: { stroke: 'transparent' },
      grid: { stroke: 'rgba(255, 255, 255, 0.2)', strokeWidth: 2 },
      tickLabels: {
        fill: 'rgba(255, 255, 255, 0.5)',
        fontFamily: 'Rubik',
        fontWeight: '400',
        fontSize: '12px',
      },
    },
  },
  bar: {
    style: {
      data: {
        stroke: '#FFF',
        strokeWidth: 1,
      },
      labels: {
        fontFamily: 'Rubik',
        fontWeight: '400',
        textAnchor: 'end',
        fontSize: '12px',
      },
    },
  },
};
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
      answerBarHeight: number;
      nextStateButtonWidth: number;
      pregameMinColumnWidth: number;
      extraExtraSmallPadding: number;
      answerOptionBorderRadius: number;
      xxSmPadding: number;
      xSmPadding: number;
      smPadding: number;
      mdPadding: number;
      lgPadding: number;
      xLgPadding: number;
      xxLgPadding: number;
      barStrokeWidth: number;
      confidenceBarThickness: number;
      defaultVictoryPadding: number;
      barThicknessResponses: number;
      barThicknessZeroResponses: number;
      labelOffsetResponses: number;
    };
    victoryTheme: {
      axis: {
        style: {
          axis: { stroke: string; strokeWidth: number };
          grid: { stroke: string };
          tickLabels: {
            padding: number;
          };
        };
      };
      dependentAxis: {
        style: {
          axis: { stroke: string };
          grid: { stroke: string; strokeWidth: number };
          tickLabels: {
            fill: string;
            fontFamily: string;
            fontWeight: string;
            fontSize: string;
          };
        };
      };
      bar: {
        style: {
          data: {
            stroke: string;
            strokeWidth: number;
          };
          labels: {
            fontFamily: string;
            fontWeight: string;
            textAnchor: string;
            fontSize: string;
          };
        };
      };
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
      answerBarHeight?: number;
      nextStateButtonWidth?: number;
      pregameMinColumnWidth?: number;
      answerOptionBorderRadius?: number;
      xxSmPadding: number;
      xSmPadding: number;
      smPadding: number;
      mdPadding: number;
      lgPadding: number;
      xLgPadding: number;
      xxLgPadding: number;
      barStrokeWidth?: number;
      confidenceBarThickness?: number;
      defaultVictoryPadding?: number;
      barThicknessResponses?: number;
      barThicknessZeroResponses?: number;
      labelOffsetResponses?: number;
    };
    victoryTheme?: {
      axis?: {
        style?: {
          axis?: { stroke: string; strokeWidth: number };
          grid?: { stroke: string };
          tickLabels?: {
            padding: number;
          };
        };
      };
      dependentAxis?: {
        style?: {
          axis?: { stroke: string };
          grid?: { stroke: string; strokeWidth: number };
          tickLabels?: {
            fill: string;
            fontFamily: string;
            fontWeight: string;
            fontSize: string;
          };
        };
      };
      bar?: {
        style?: {
          data?: {
            stroke: string;
            strokeWidth: number;
          };
          labels?: {
            fontFamily: string;
            fontWeight: string;
            textAnchor: string;
            fontSize: string;
          };
        };
      };
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
    playerFeedbackLabelColor: string;
    feedbackCardsInstructionsColor: string;
    graphAccentColor: string;
    dropdownInfoBackgroundColor: string;
    answerBarBackgroundColor: string;
    progressBarColor: string;
    progressBarBackgroundColor: string;
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
    playerFeedbackLabelColor?: string;
    feedbackCardsInstructionsColor?: string;
    graphAccentColor?: string;
    dropdownInfoBackgroundColor?: string;
    answerBarBackgroundColor?: string;
    progressBarColor?: string;
    progressBarBackgroundColor?: string;
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
    answerBarHeight,
    nextStateButtonWidth,
    pregameMinColumnWidth,
    xxSmPadding,
    xSmPadding,
    smPadding,
    mdPadding,
    lgPadding,
    xLgPadding,
    xxLgPadding,
    answerOptionBorderRadius,
    barStrokeWidth,
    confidenceBarThickness,
    defaultVictoryPadding,
    barThicknessResponses,
    barThicknessZeroResponses,
    labelOffsetResponses,
  },
  victoryTheme: customVictoryTheme,
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
      playerFeedbackLabelColor,
      feedbackCardsInstructionsColor,
      graphAccentColor,
      dropdownInfoBackgroundColor,
      answerBarBackgroundColor,
      progressBarColor,
      progressBarBackgroundColor,
      countdownColor,
      radialTimerArray,
    },
  },
  typography: {
    fontFamily: 'Poppins',
    h1: {
      // screen titles
      fontWeight: '800',
      fontSize: '26px',
      lineHeight: '30px',
      color: primaryTextColor,
    },
    h2: {
      // launch game title
      fontWeight: '800',
      fontSize: '72px',
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
      fontFamily: 'Poppins',
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
