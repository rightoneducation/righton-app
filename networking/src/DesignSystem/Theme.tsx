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
const timerGradient = 'linear-gradient(90deg, #90E8FE 0%, #36D7F7 100%)'; // timer bar
const altHighlightGradient =
  'linear-gradient(190deg, #7BDD61 0%, #22B851 100%)'; // new points score indicator
const primaryTextColor = '#FFFFFF'; // main text (headers, titles)
const secondaryTextColor = '#384466'; // secondary text (question text, answer text)
const darkestTextColor = '#000000'; // darkest color for text(ex black)
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
    lightPurple: '#B59AEB', // use case: selected answer border - donut chart
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
    deepPurple: '#3400A8', // use case: phase 2 new score pill
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
    play: {
      newScore: 'linear-gradient(170deg, #EB147C 0%, #22B851 100%)', // use case: score indicator new points pill (10deg counter-clockwise from top→bottom)
    },
  },
};

const designSystemTypography = {
  h0: {
    fontFamily: 'Poppins',
    fontWeight: 800,
    fontSize: '26px',
    lineHeight: 'normal',
    letterSpacing: 'normal',
  },
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
const xSmPadding = 8; // small icons, text positioning
const smPadding = 16; // upper and lower margins on text, spacing of content in cards
const mdPadding = 24; // timer margin
const lgPadding = 32; // text spacing on answer selector, top margin on titles
const xLgPadding = 48; // spacing between card and edge of screen
const xxLgPadding = 64; // spacing between buttons and bottom of screen

// ============================================================================
// HOST theme tokens (relocated from host_v2/src/lib/Theme.tsx during the
// host/play UI refresh). Suffixed `Host` to coexist with play's tokens above.
// Values copied verbatim; host keeps its own values independently of play.
// ============================================================================

// host - colors (host-specific only; tokens identical to play reuse play's consts above):
const darkBlueCardColorHost = '#06225A'; // card color for default host cards with student data
const backgroundGradientHost =
  'linear-gradient(196deg, rgb(49,109,176) 0%, rgb(11,33,90) 73%)'; // upper header background
const timerGradientHost = 'linear-gradient(90deg, #168CDC 0%, #00A7E8 100%)';
const questionGradientHost =
  'linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 50%, rgba(255,255,255,0) 50%, rgba(255,255,255,0) 100%)'; //  current question indicator
const circularProgressHost = '#159EFA';
const playerNameTextColorHost = '#AEAEAE'; // player name
const baseQuestionColorHost = 'rgba(255,255,255,0.2)'; //
const playerFeedbackLabelColorHost = 'rgba(255, 255, 255, 0.4)'; // color of text on confidence card, responses card, player thinking, etc.
const feedbackCardsInstructionsColorHost = 'rgba(255, 255, 255, 0.6)'; // color of text on player data cards that says 'tap on a response...'
const graphAccentColorHost = 'rgba(255, 255, 255, 0.2)'; // color of graph axis and bar outline on confidence card, responses card, etc.
const dropdownInfoBackgroundColorHost = '#063772'; // background color of the sub-cards in the player response dropdowns
const answerBarBackgroundColorHost = 'rgba(8, 69, 143, 0.20)';
const progressBarColorHost = '#08458F';
const radialTimerArrayHost = [
  'rgb(126, 90, 175)',
  'rgb(148, 98, 179)',
  'rgb(169, 104, 180)',
  'rgb(186, 107, 177)',
  'rgb(202, 109, 172)',
  'rgb(218, 112, 168)',
  'rgb(237, 115, 166)',
  'rgb(255, 120, 165)',
]; // radial timer color array - appended with '0.x )' opacity when used in countdown

// host - borders:
const borderWidthHost = 1;
const solidWhiteHost = `${borderWidthHost}px solid rgba(255, 255, 255, 1)`;
const transparentHost = `${borderWidthHost}px solid rgba(255, 255, 255, 0)`;
const semiTransparentHost = `${borderWidthHost}px solid rgba(255, 255, 255, 0.2)`;

// host - breakpoints (host-specific; xl (1536) is identical to play's — reused directly):
const xsHost = 0;
const smHost = 400;
const mdHost = 700;
const lgHost = 1024;

// host - header, footer, padding sizes:
const fullHeaderHeightHost = 228;
const headerHeightHost = 140;
const footerHeightHost = 144;
const answerBarHeightHost = 18;
const nextStateButtonWidthHost = 300;
const pregameMinColumnWidthHost = 248; // used on enter game code screen and righton logo
const answerOptionBorderRadiusHost = 22; // border radius of options on answer cards
const xxSmPaddingHost = 4; // positioning in Victory Graphs (host-only; no play equivalent)
// xSm/sm/md/lg/xLg/xxLg paddings are identical to play's scale above — reused directly.
const barStrokeWidthHost = 2; // stroke width of the bar outlines on host graph cards
const confidenceBarThicknessHost = 55; // thickness of each bar component in confidence bar graph

// host - Victory Graphs Theming
// victory applies a default of 50px to the VictoryChart component
const defaultVictoryPaddingHost = 50;
const barThicknessResponsesHost = 18;
const barThicknessZeroResponsesHost = 26;
const labelOffsetResponsesHost = 3;

const customVictoryResponsesThemeHost = {
  axis: {
    style: {
      axis: { stroke: 'rgba(255, 255, 255, 0.2)', strokeWidth: 2 },
      grid: { stroke: 'transparent' },
      tickLabels: {
        padding: mdPadding,
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
        fill: ({ datum, index }: any) =>
          index === 0 || datum.answerCount === 0
            ? '#FFF'
            : '#384466',
        fontFamily: 'Rubik',
        fontWeight: '400',
        textAnchor: 'end',
        fontSize: '12px',
      },
    },
  },
};

const customVictoryConfidenceThemeHost = {
  axis: {
    style: {
      axis: {
        stroke: graphAccentColorHost,
        strokeWidth: barStrokeWidthHost,
      },
      grid: { stroke: 'transparent' },
      tickLabels: {
        padding: xSmPadding,
        fill: playerFeedbackLabelColorHost,
        fontSize: '18px',
      },
    },
  },
  stack: {
    colorScale: [primaryTextColor, 'transparent'],
    style: {
      data: {
        stroke: primaryTextColor,
        strokeWidth: barStrokeWidthHost,
      },
    },
  },
  bar: {
    barWidth: confidenceBarThicknessHost,
  },
};

// adds mainGradient field to the palette theme
declare module '@mui/material/styles' {
  interface Theme {
    sizing: {
      headerHeight: number;
      footerHeight: number;
      pregameMinColumnWidth: number;
      fullHeaderHeight: number;
      answerBarHeight: number;
      nextStateButtonWidth: number;
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
    // host-only augmentations (consumed by HostTheme)
    borders: {
      borderWidth: number;
      solidWhite: string;
      transparent: string;
      semiTransparent: string;
    };
    victoryResponsesTheme: {
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
    victoryConfidenceTheme: {
      axis: {
        style: {
          axis: {
            stroke: string;
            strokeWidth: number;
          };
          grid: { stroke: string };
          tickLabels: {
            padding: number;
            fill: string;
            fontSize: string;
          },
        },
      },
      stack: {
        colorScale: string[];
        style: {
          data: {
            stroke: string;
            strokeWidth: number;
          },
        },
      },
      bar: {
        style: {
          data: {
            fill: string;
          },
        },
        barWidth: number;
      },
    }
  }

  interface ThemeOptions {
    sizing?: {
      headerHeight?: number;
      footerHeight?: number;
      pregameMinColumnWidth?: number;
      fullHeaderHeight?: number;
      answerBarHeight?: number;
      nextStateButtonWidth?: number;
      answerOptionBorderRadius?: number;
      xxSmPadding?: number;
      xSmPadding?: number;
      smPadding?: number;
      mdPadding?: number;
      lgPadding?: number;
      xLgPadding?: number;
      xxLgPadding?: number;
      barStrokeWidth?: number;
      confidenceBarThickness?: number;
      defaultVictoryPadding?: number;
      barThicknessResponses?: number;
      barThicknessZeroResponses?: number;
      labelOffsetResponses?: number;
    };
    // host-only augmentations (consumed by HostTheme)
    borders?: {
      borderWidth?: number;
      solidWhite?: string;
      transparent?: string;
      semiTransparent?: string;
    };
    victoryResponsesTheme?: {
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
    victoryConfidenceTheme?: {
      axis?: {
        style?: {
          axis?: {
            stroke: string;
            strokeWidth: number;
          };
          grid?: { stroke: string };
          tickLabels?: {
            padding: number;
            fill: string;
            fontSize: string;
          },
        },
      },
      stack?: {
        colorScale?: string[];
        style?: {
          data: {
            stroke: string;
            strokeWidth: number;
          },
        },
      },
      bar?: {
        style?: {
          data?: {
            fill: string;
          },
        },
        barWidth: number;
      },
    }
  }

  interface PaletteColor {
    accent: string;
    backgroundGradient: string;
    splashScreenBackgroundGradient: string;
    radialGradient: string;
    highlightGradient: string;
    altHighlightGradient: string;
    timerGradient: string;
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
    // host-only palette keys (consumed by HostTheme)
    darkBlueCardColor: string;
    questionGradient: string;
    circularProgress: string;
    baseQuestionColor: string;
    playerFeedbackLabelColor: string;
    feedbackCardsInstructionsColor: string;
    graphAccentColor: string;
    dropdownInfoBackgroundColor: string;
    answerBarBackgroundColor: string;
    progressBarColor: string;
  }

  interface SimplePaletteColorOptions {
    accent?: string;
    backgroundGradient?: string;
    splashScreenBackgroundGradient?: string;
    radialGradient?: string;
    highlightGradient?: string;
    altHighlightGradient?: string;
    timerGradient?: string;
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
    // host-only palette keys (consumed by HostTheme)
    darkBlueCardColor?: string;
    questionGradient?: string;
    circularProgress?: string;
    baseQuestionColor?: string;
    playerFeedbackLabelColor?: string;
    feedbackCardsInstructionsColor?: string;
    graphAccentColor?: string;
    dropdownInfoBackgroundColor?: string;
    answerBarBackgroundColor?: string;
    progressBarColor?: string;
  }

  interface Palette {
    designSystem: typeof designSystemColors;
  }

  interface PaletteOptions {
    designSystem?: typeof designSystemColors;
  }

  interface TypographyVariants {
    designSystem: typeof designSystemTypography;
    h0: CSSProperties;
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
    pinkLabel: CSSProperties;
    label: CSSProperties;
    answerTypeLabel: CSSProperties;
    rubikBody: CSSProperties;
    rubikBodyLarge: CSSProperties;
  }

  interface TypographyVariantsOptions {
    designSystem?: typeof designSystemTypography;
    h0?: CSSProperties;
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
    pinkLabel?: CSSProperties;
    label?: CSSProperties;
    answerTypeLabel?: CSSProperties;
    rubikBody?: CSSProperties;
    rubikBodyLarge?: CSSProperties;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    h0: true;
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
    pinkLabel: true;
    label: true;
    answerTypeLabel: true;
    rubikBody: true;
    rubikBodyLarge: true;
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
    xSmPadding,
    smPadding,
    mdPadding,
    lgPadding,
    xLgPadding,
    xxLgPadding,
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
      timerGradient,
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
          h0: 'h1',
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
    h0: { ...designSystemTypography.h0, color: primaryTextColor },
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
      color: primaryTextColor,
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

const HostTheme = createTheme({
  breakpoints: {
    values: { xs: xsHost, sm: smHost, md: mdHost, lg: lgHost, xl },
  },
  borders: {
    borderWidth: borderWidthHost,
    solidWhite: solidWhiteHost,
    transparent: transparentHost,
    semiTransparent: semiTransparentHost,
  },
  sizing: {
    fullHeaderHeight: fullHeaderHeightHost,
    headerHeight: headerHeightHost,
    footerHeight: footerHeightHost,
    answerBarHeight: answerBarHeightHost,
    nextStateButtonWidth: nextStateButtonWidthHost,
    pregameMinColumnWidth: pregameMinColumnWidthHost,
    xxSmPadding: xxSmPaddingHost,
    xSmPadding,
    smPadding,
    mdPadding,
    lgPadding,
    xLgPadding,
    xxLgPadding,
    answerOptionBorderRadius: answerOptionBorderRadiusHost,
    barStrokeWidth: barStrokeWidthHost,
    confidenceBarThickness: confidenceBarThicknessHost,
    defaultVictoryPadding: defaultVictoryPaddingHost,
    barThicknessResponses: barThicknessResponsesHost,
    barThicknessZeroResponses: barThicknessZeroResponsesHost,
    labelOffsetResponses: labelOffsetResponsesHost,
  },
  victoryResponsesTheme: customVictoryResponsesThemeHost,
  victoryConfidenceTheme: customVictoryConfidenceThemeHost,
  palette: {
    primary: {
      main: mainColor,
      accent: accentColor,
      darkBlueCardColor: darkBlueCardColorHost,
      backgroundGradient: backgroundGradientHost,
      radialGradient,
      timerGradient: timerGradientHost,
      highlightGradient,
      altHighlightGradient,
      questionGradient: questionGradientHost,
      circularProgress: circularProgressHost,
      red: redColor,
      green: greenColor,
      darkPurple: darkPurpleColor,
      blue: blueColor,
      darkBlue: secondaryTextColor,
      extraDarkGrey: extraDarkGreyColor,
      darkGrey: darkGreyColor,
      lightGrey: lightGreyColor,
      correctColor: greenCorrectColor,
      baseQuestionColor: baseQuestionColorHost,
      playerFeedbackLabelColor: playerFeedbackLabelColorHost,
      feedbackCardsInstructionsColor: feedbackCardsInstructionsColorHost,
      graphAccentColor: graphAccentColorHost,
      dropdownInfoBackgroundColor: dropdownInfoBackgroundColorHost,
      answerBarBackgroundColor: answerBarBackgroundColorHost,
      progressBarColor: progressBarColorHost,
      progressBarBackgroundColor,
      countdownColor,
      radialTimerArray: radialTimerArrayHost,
    },
    designSystem: designSystemColors,
  },
  typography: {
    fontFamily: 'Poppins',
    designSystem: designSystemTypography,
    pinkLabel: {
      fontFamily: 'Poppins',
      fontWeight: 600,
      fontSize: '14px',
      color: designSystemColors.surface.pink,
    },
    label: {
      fontFamily: 'Rubik',
      fontWeight: 400,
      fontSize: '14px',
      color: primaryTextColor,
    },
    answerTypeLabel: {
      fontFamily: 'Poppins',
      fontWeight: 400,
      fontSize: '12px',
      color: primaryTextColor,
    },
    rubikBody: {
      fontFamily: 'Rubik',
      fontWeight: 400,
      fontSize: '18px',
      color: designSystemColors.surface.play
    },
    rubikBodyLarge: {
      fontFamily: 'Rubik',
      fontWeight: 400,
      fontSize: '20px',
    },
    h1: {
      // screen titles
      fontWeight: '700',
      fontSize: '24px',
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
      color: playerNameTextColorHost,
    },
    h4: {
      // answer card title
      fontSize: '16px',
      lineHeight: '20px',
      fontWeight: 600,
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

export { RightOnTheme, HostTheme };
export default RightOnTheme;
