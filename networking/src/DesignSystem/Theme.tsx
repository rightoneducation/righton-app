import { createTheme } from '@mui/material/styles';
import type { CSSProperties } from 'react';

// design tokens - colors: (comments = example usage)
const mainColor = '#FFFFFF'; // main  (ex white)
const accentColor = '#312759'; // accent (ex purple)
const backgroundGradient =
  'linear-gradient(to right, rgba(62, 0, 172, 1), rgba(98, 0, 204, 1))'; // upper header background
// const radialGradient =
// 'radial-gradient(circle farthest-side, #7D63C8, #7D63C8 100%)';
const splashScreenBackgroundGradient =
  'linear-gradient(180deg, #2A124F, #6029B5)';
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
const progressBarBackgroundColor = '#D0DAE7'; // progress bar background color
const progressBarSelectedColor = '#499BF3'; // progress bar when player has selected the answer
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

const designSystemColors = {
  background: {
    host: {
      base: '#FFFFFF', // use case: background
    },
    central: {
      deepBlue: '#02215F', // use case: background
      darkNavy: '#011849', // use case: background
      accentBlue: '#22499C', // use case: background
      purple: '#4700B2', // use case: background
    },
  },
  foreground: {
    base: '#FFFFFF', // use case: card background
    warmBase: '#FFFBF6', // use case: light text background
    blue: '#08458F', // use case: card background
    darkBlue: '#063772', // use case: list item
    overlay: '#F4F4F4', // use case: overlay on card
    strokeGray: '#CCCCCC', // use case: stroke - play carousel
    strokeWhite: 'rgba(255, 255, 255, 0.25)', // use case: stroke - host
    brightBlue: '#1FBBFF', // use case: score pill
    timerBgPlay: 'rgba(255, 255, 255, 0.25)', // use case: timer bg - play
    timerHost: '#08458F', // use case: timer - host
    timerBgHost: 'rgba(8, 69, 143, 0.20)', // use case: timer bg - host
    donutChart: {
      blue: '#169FFA', // use case: donut chart - bar
      paleBlue: '#E7F5FF', // use case: donut chart - bar
      purple: '#5316B2', // use case: donut chart - bar
      palePurple: '#F4EEFF', // use case: donut chart - bar
    },
    lightYellow: '#FBB971', // use case: leaderboard announcement
    green: '#26B34C', // use case: leaderboard top 6
    salmon: '#F75967', // use case: leaderboard top 6
    darkTeal: '#167193', // use case: leaderboard top 6
    plum: '#B21F5B', // use case: leaderboard top 6
    mustard: '#F69F40', // use case: leaderboard top 6
    skyBlue: '#1B8DD2', // use case: leaderboard top 6
  },
  surface: {
    play: '#1B376F', // use case: text on card
    host: '#384466', // use case: text on card
    central: '#02215F', // use case: text on card
    secondary: '#FFFFFF', // use case: text on card
    tertiary: '#384466', // use case: text on card
    tertiaryGray: '#666666', // use case: text on card
    tertiaryMuted: '#A5ABBA', // use case: number on card
    pink: '#EB147C', // use case: accent button
    lightPink: '#FF2E96', // use case: header text
    coralPink: '#FF3A6A', // use case: header text
    coolBlue: '#0076AA', // use case: accent list text
  },
  status: {
    correct: '#EBFFDA', // use case: correct
    error: '#D0254D', // use case: error
  },
  // angle defaulted to 180deg (top → bottom); confirm with design.
  gradients: {
    background: {
      play: 'linear-gradient(180deg, #290F51 0%, #5C27AE 100%)', // use case: background
      host: 'linear-gradient(180deg, #02215F 0%, #0D68B1 100%)', // use case: background
      central: 'linear-gradient(180deg, #02215F 43%, rgba(2, 33, 95, 0) 100%)', // use case: nav heading
    },
    leaderboard: {
      green: 'linear-gradient(180deg, #4DED66 0%, #5ACD3D 100%)', // use case: team 1
      purple: 'linear-gradient(180deg, #7E00C4 0%, #9139F8 100%)', // use case: team 2
      red: 'linear-gradient(180deg, #69000B 0%, #8B000A 100%)', // use case: team 3
      blue: 'linear-gradient(180deg, #0A4178 0%, #0F56A1 100%)', // use case: team 4
      yellow: 'linear-gradient(180deg, #FED52B 0%, #C64E0F 100%)', // use case: team 5
    },
    website: {
      cottonCandy: 'linear-gradient(180deg, #F87CE0 0%, #7EBBEB 100%)', // use case: website
      darkPurple: 'linear-gradient(180deg, #4700B2 0%, #5A257D 100%)', // use case: website
    },
  },
};

const designSystemTypography = {
  title: {
    fontFamily: 'Poppins',
    fontWeight: 700,
    fontSize: '40px',
    lineHeight: '130%',
    letterSpacing: 'normal',
  },
  h1: {
    fontFamily: 'Poppins',
    fontWeight: 700,
    fontSize: '24px',
    lineHeight: '130%',
    letterSpacing: 'normal',
  }, // main header
  h2: {
    fontFamily: 'Poppins',
    fontWeight: 700,
    fontSize: '20px',
    lineHeight: '24px',
    letterSpacing: 'normal',
  }, // button labels
  h3: {
    fontFamily: 'Poppins',
    fontWeight: 800,
    fontSize: '20px',
    lineHeight: '23px',
    letterSpacing: 'normal',
  },
  h4: {
    fontFamily: 'Poppins',
    fontWeight: 600,
    fontSize: '16px',
    lineHeight: 'normal',
    letterSpacing: 'normal',
  },
  paragraph: {
    fontFamily: 'Rubik',
    fontWeight: 400,
    fontSize: '16px',
    lineHeight: 'normal',
    letterSpacing: 'normal',
  },
  semiBoldParagraph: {
    fontFamily: 'Rubik',
    fontWeight: 600,
    fontSize: '16px',
    lineHeight: 'normal',
    letterSpacing: 'normal',
  },
  questionLabel: {
    fontFamily: 'Rubik',
    fontWeight: 400,
    fontSize: '14px',
    lineHeight: 'normal',
    letterSpacing: 'normal',
  },
  answerOption: {
    fontFamily: 'Rubik',
    fontWeight: 400,
    fontSize: '16px',
    lineHeight: 'normal',
    letterSpacing: 'normal',
  },
  boldLabel: {
    fontFamily: 'Rubik',
    fontWeight: 700,
    fontSize: '14px',
    lineHeight: 'normal',
    letterSpacing: 'normal',
  },
  responseLabel: {
    fontFamily: 'Rubik',
    fontWeight: 800,
    fontSize: '14px',
    lineHeight: 'normal',
    letterSpacing: 'normal',
  },
  smallLabel: {
    fontFamily: 'Rubik',
    fontWeight: 400,
    fontSize: '12px',
    lineHeight: 'normal',
    letterSpacing: 'normal',
  },
  xsLabel: {
    fontFamily: 'Rubik',
    fontWeight: 400,
    fontSize: '10px',
    lineHeight: 'normal',
    letterSpacing: 'normal',
  },
  equation: {
    fontFamily: '"Times New Roman", serif',
    fontStyle: 'italic',
    fontWeight: 400,
    fontSize: '18px',
    lineHeight: 'normal',
    letterSpacing: 'normal',
  },
  textLabel: {
    fontFamily: 'Karla',
    fontWeight: 800,
    fontSize: '18px',
    lineHeight: 'normal',
    letterSpacing: 'normal',
  },
};

// design tokens - breakpoints:
const xs = 400;
const sm = 700;
const md = 900;
const lg = 1200;
const xl = 1536;

// design tokens - header, footer, padding sizes (coordinate this approach with U/X team): (comments = example usage)
const headerHeight = 116;
const footerHeight = 145;
const pregameMinColumnWidth = 352; // used on enter game code screen and righton logo
const extraSmallPadding = 8; // small icons, text positioning
const smallPadding = 16; // upper and lower margins on text, spacing of content in cards
const mediumPadding = 24; // timer margin
const largePadding = 32; // text spacing on answer selector, top margin on titles
const extraLargePadding = 48; // spacing between card and edge of screen
const extraExtraLargePadding = 64; // spacing between buttons and bottom of screen

// adds mainGradient field to the palette theme
declare module '@mui/material/styles' {
  interface Theme {
    sizing: {
      headerHeight: number;
      footerHeight: number;
      pregameMinColumnWidth: number;
      extraSmallPadding: number;
      smallPadding: number;
      mediumPadding: number;
      largePadding: number;
      extraLargePadding: number;
      extraExtraLargePadding: number;
    };
  }

  interface ThemeOptions {
    sizing?: {
      headerHeight?: number;
      footerHeight?: number;
      pregameMinColumnWidth?: number;
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
    splashScreenBackgroundGradient: string;
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
    countdownColor: string;
    radialTimerArray: string[];
    progressBarBackgroundColor: string;
    progressBarSelectedColor: string;
  }

  interface SimplePaletteColorOptions {
    accent?: string;
    backgroundGradient?: string;
    splashScreenBackgroundGradient?: string;
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
    countdownColor: string;
    radialTimerArray?: string[];
    progressBarBackgroundColor?: string;
    progressBarSelectedColor?: string;
  }

  interface Palette {
    designSystem: typeof designSystemColors;
  }

  interface PaletteOptions {
    designSystem?: typeof designSystemColors;
  }

  interface TypographyVariants {
    designSystem: typeof designSystemTypography;
    title: CSSProperties;
    paragraph: CSSProperties;
    semiBoldParagraph: CSSProperties;
    questionLabel: CSSProperties;
    answerOption: CSSProperties;
    boldLabel: CSSProperties;
    responseLabel: CSSProperties;
    smallLabel: CSSProperties;
    xsLabel: CSSProperties;
    equation: CSSProperties;
    textLabel: CSSProperties;
  }

  interface TypographyVariantsOptions {
    designSystem?: typeof designSystemTypography;
    title?: CSSProperties;
    paragraph?: CSSProperties;
    semiBoldParagraph?: CSSProperties;
    questionLabel?: CSSProperties;
    answerOption?: CSSProperties;
    boldLabel?: CSSProperties;
    responseLabel?: CSSProperties;
    smallLabel?: CSSProperties;
    xsLabel?: CSSProperties;
    equation?: CSSProperties;
    textLabel?: CSSProperties;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    title: true;
    paragraph: true;
    semiBoldParagraph: true;
    questionLabel: true;
    answerOption: true;
    boldLabel: true;
    responseLabel: true;
    smallLabel: true;
    xsLabel: true;
    equation: true;
    textLabel: true;
  }
}

const RightOnTheme = createTheme({
  breakpoints: {
    values: { xs, sm, md, lg, xl },
  },
  sizing: {
    headerHeight,
    footerHeight,
    pregameMinColumnWidth,
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
      backgroundGradient,
      splashScreenBackgroundGradient,
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
      countdownColor,
      radialTimerArray,
      progressBarBackgroundColor,
      progressBarSelectedColor,
    },
    designSystem: designSystemColors,
  },
  components: {
    MuiTypography: {
      defaultProps: {
        variantMapping: {
          title: 'h1',
          paragraph: 'p',
          semiBoldParagraph: 'p',
          questionLabel: 'p',
          answerOption: 'p',
          boldLabel: 'p',
          responseLabel: 'p',
          smallLabel: 'p',
          xsLabel: 'p',
          equation: 'p',
          textLabel: 'p',
        },
      },
    },
  },
  typography: {
    fontFamily: 'Karla',
    designSystem: designSystemTypography,
    title: { ...designSystemTypography.title, color: primaryTextColor },
    paragraph: { ...designSystemTypography.paragraph, color: primaryTextColor },
    semiBoldParagraph: { ...designSystemTypography.semiBoldParagraph, color: primaryTextColor },
    questionLabel: { ...designSystemTypography.questionLabel, color: primaryTextColor },
    answerOption: { ...designSystemTypography.answerOption, color: primaryTextColor },
    boldLabel: { ...designSystemTypography.boldLabel, color: primaryTextColor },
    responseLabel: { ...designSystemTypography.responseLabel, color: primaryTextColor },
    smallLabel: { ...designSystemTypography.smallLabel, color: primaryTextColor },
    xsLabel: { ...designSystemTypography.xsLabel, color: primaryTextColor },
    equation: { ...designSystemTypography.equation, color: primaryTextColor },
    textLabel: { ...designSystemTypography.textLabel, color: primaryTextColor },
    h1: {
      // screen titles
      ...designSystemTypography.h1,
      color: primaryTextColor,
    },
    h2: {
      // column titles
      ...designSystemTypography.h2,
      color: primaryTextColor,
    },
    h3: {
      // player name
      ...designSystemTypography.h3,
      color: playerNameTextColor,
    },
    h4: {
      // answer card title
      ...designSystemTypography.boldLabel,
      color: secondaryTextColor,
    },
    h5: {
      // card answer list letters (A, B, C, D, etc)
      ...designSystemTypography.answerOption,
      color: secondaryTextColor,
    },
    h6: {
      // screen titles
      ...designSystemTypography.title,
      color: primaryTextColor,
    },
    subtitle1: {
      // correct/nice try discuss answer text
      ...designSystemTypography.h1,
      color: darkestTextColor,
    },
    body1: {
      // question text
      ...designSystemTypography.paragraph,
      color: secondaryTextColor,
    },
    body2: {
      // answer text
      ...designSystemTypography.answerOption,
      textAlign: 'left',
      color: secondaryTextColor,
    },
    button: {
      // button text
      ...designSystemTypography.h4,
      color: primaryTextColor,
    },
    caption: {
      // timer text
      ...designSystemTypography.smallLabel,
      color: primaryTextColor,
      opacity: '0.8',
    },
    overline: {
      // scoreIndicator text
      ...designSystemTypography.equation,
      color: primaryTextColor,
      textShadow: '0px 1px 1px rgba(0, 0, 0, 0.15)',
    },
  },
});

export { RightOnTheme };
export default RightOnTheme;
