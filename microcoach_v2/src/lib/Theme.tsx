import type { CSSProperties } from 'react';
import { createTheme } from '@mui/material/styles';

const rubik = "'Rubik', sans-serif";
const poppins = "'Poppins', sans-serif";
const karla = "'Karla', sans-serif";

const designSystemColors = {
  background: {
    offWhite: '#FFFDFB',
    cream: '#FFFBF6',
    navyBlue: '#1B3467',
    greyOverlay: '#B2B0AC',
  },
  foreground: {
    base: '#FFFFFF',
    accentBlue: '#4A6FA5',
    fadedBlue: '#9FAFC7',
    lightBlue: '#CADDE8',
    greyAccent: '#E2EAEE',
    fadedLightBlue: '#E3EEF4',
    skyBlue: '#EAF7FE',
    fadedLightNavyBlue: '#DAE4F3',
    fadedNavyBlue: '#92A8C7',
    periwinkle: '#C3D5E3',
    wildSand: '#F4F5F3',
    brightBlue: '#375EF9',
    // surface.atlanticNavy at 20% — the resting outline for controls whose
    // selected state is the same navy at full strength.
    fadedAtlanticNavy: '#1B376F33',
    disabledStroke: '#AAAAAA',
    mutedGrey: '#8F8F8F',
    selectedNavy: '#1B2A6B',
    // Muted label grey above a field or panel ("Student task"). Darker and
    // cooler than mutedGrey, which is too light to sit on a grey fill.
    slateGrey: '#6B7280',
    // Sign-up flow: the "or" divider between the Google button and the form,
    // and the digit inside a filled verification box.
    slateNavy: '#384466',
    // The verification box outline, before and after a digit is typed — the
    // filled state deliberately recedes so the digit carries the emphasis.
    codeStroke: '#4E628C',
    codeStrokeFilled: '#CCCCCC',
  },
  surface: {
    atlanticNavy: '#1B376F',
    darkBlue: '#02215F',
    secondary: '#FFFDFB',
    black: '#000000',
    white: '#FFFFFF',
    neutralGray: '#E4E3E2',
    skyBlue: '#EAF7FE',
    steelBlue: '#4A6FA5',
    lightGreen: '#ECFFE3',
    green: '#3EBF8F',
    ashyGray: '#635F5F',
    placeholderGrey: '#294478',
  },
  status: {
    base: '#FFFFFF',
    success: '#3EBF8F',
    lightGreen: '#ECFFE3',
    uploading: '#DFEDF3',
    uploadingIcon: '#375EF9',
    uploadingStroke: '#4A6FA5',
    error: '#FFF3F3',
    errorStroke: '#E42F2F',
    // Misconception detail: students who need support, students who understood,
    // and the prerequisite-gap standard codes.
    needsSupport: '#F49F82',
    understood: '#BDE9CA',
    prerequisite: '#CC5500',
    // The error family used across the activity templates. Figma draws the
    // worked-example row and the compare column as #D0254D at 30% but paints
    // the verdict chip as the flat #F1BECA — which is that exact composite
    // over white. One solid token covers all three: every surface it lands on
    // is white, and a 6-digit value also survives the PDF renderer, whose
    // colour parser has no alpha. Distinct from status.error, the pale wash
    // used for form-level errors.
    errorTint: '#F1BECA',
    // The ✗ marker beside an incorrect observation.
    errorIcon: '#E68A9F',
    // status.lightGreen at 50% over white — the "Matches" representation card.
    successTint: '#F6FFF1',
  },
  // The plotted graph inside a representation card. Charts are their own
  // surface with their own legibility needs — same reason `gradients` is
  // namespaced rather than folded into `foreground`.
  chart: {
    axis: '#333333',
    gridLabel: '#BBBBBB',
    line: '#1A6FB5',
    annotation: '#E07B00',
  },
  gradients: {
    uploadIcons:
      'linear-gradient(180deg, #E0E5E9 0%, #A2CADD 39%, #4A6FA5 100%)',
  },
};

const designSystemTypography = {
  title: {
    fontFamily: rubik,
    fontWeight: 500,
    fontSize: '64px',
    lineHeight: 'normal',
    // The 393 frame sets the hero title at 40px (48px line box); the 744 frame
    // keeps it at 64px, so this steps down at SMALL only.
    '@media (max-width:699px)': {
      fontSize: '40px',
    },
  },
  h1: {
    fontFamily: rubik,
    fontWeight: 500,
    fontSize: '52px',
    lineHeight: 'normal',
  },
  h2: {
    fontFamily: rubik,
    fontWeight: 500,
    fontSize: '32px',
    lineHeight: '36px',
  },
  h3: {
    fontFamily: rubik,
    fontWeight: 600,
    fontSize: '40px',
    lineHeight: 'normal',
  },
  h4: {
    fontFamily: rubik,
    fontWeight: 400,
    fontSize: '20px',
    lineHeight: 'normal',
  },
  navTitle: {
    fontFamily: rubik,
    fontWeight: 500,
    fontSize: '32px',
    lineHeight: 'normal',
  },
  navTitle2: {
    fontFamily: rubik,
    fontWeight: 500,
    fontSize: '28px',
    lineHeight: 'normal',
  },
  smallTitle: {
    fontFamily: rubik,
    fontWeight: 500,
    fontSize: '24px',
    lineHeight: 'normal',
  },
  paragraph1: {
    fontFamily: poppins,
    fontWeight: 400,
    fontSize: '28px',
    letterSpacing: '0.05em',
  },
  paragraph2: {
    fontFamily: poppins,
    fontWeight: 300,
    fontSize: '20px',
    lineHeight: '28px',
  },
  footer: {
    fontFamily: rubik,
    fontWeight: 700,
    fontSize: '20px',
  },
  uploadLabel: {
    fontFamily: rubik,
    fontWeight: 400,
    fontSize: '20px',
    lineHeight: 'normal',
  },
  submissionLabel: {
    fontFamily: poppins,
    fontWeight: 500,
    fontSize: '22px',
    lineHeight: 'normal',
  },
  placeholderLabel: {
    fontFamily: poppins,
    fontWeight: 500,
    fontSize: '16px',
    lineHeight: 'normal',
  },
  mediumLabel: {
    fontFamily: poppins,
    fontWeight: 500,
    fontSize: '20px',
    lineHeight: 'normal',
  },
  bodyText: {
    fontFamily: poppins,
    fontWeight: 400,
    fontSize: '16px',
    lineHeight: 'normal',
  },
  smallPopupLabel: {
    fontFamily: rubik,
    fontWeight: 400,
    fontSize: '16px',
    lineHeight: 'normal',
    letterSpacing: '0.25px',
  },
  titleLight: {
    fontFamily: rubik,
    fontWeight: 300,
    fontSize: '20px',
    lineHeight: 'normal',
  },
  xsLabel: {
    fontFamily: poppins,
    fontWeight: 400,
    fontSize: '14px',
    lineHeight: 'normal',
  },
  microLabel: {
    fontFamily: rubik,
    fontWeight: 400,
    fontSize: '12px',
    lineHeight: 'normal',
  },
  appTitle: {
    fontFamily: rubik,
    fontWeight: 600,
    fontSize: '32px',
    lineHeight: 'normal',
  },
  rubikBody: {
    fontFamily: rubik,
    fontWeight: 400,
    fontSize: '16px',
    lineHeight: 'normal',
  },
  rubikBodyBold: {
    fontFamily: rubik,
    fontWeight: 700,
    fontSize: '16px',
    lineHeight: 'normal',
  },
  rubikSubBold: {
    fontFamily: rubik,
    fontWeight: 700,
    fontSize: '14px',
    lineHeight: 'normal',
  },
  buttonLabel: {
    fontFamily: rubik,
    fontWeight: 500,
    fontSize: '16px',
    lineHeight: 'normal',
    letterSpacing: '-0.02em',
  },
  buttonLabelSm: {
    fontFamily: rubik,
    fontWeight: 500,
    fontSize: '14px',
    lineHeight: 'normal',
    letterSpacing: '-0.02em',
  },
  planSubheading: {
    fontFamily: karla,
    fontWeight: 600,
    fontSize: '16px',
    lineHeight: 'normal',
    letterSpacing: '-0.04em',
  },
  buttonLabelSmLight: {
    fontFamily: rubik,
    fontWeight: 400,
    fontSize: '14px',
    lineHeight: 'normal',
    letterSpacing: '-0.02em',
  },
  stepLabel: {
    fontFamily: rubik,
    fontWeight: 500,
    fontSize: '20px',
    lineHeight: 'normal',
  },
  stepNumber: {
    fontFamily: rubik,
    fontWeight: 500,
    fontSize: '26px',
    lineHeight: 'normal',
  },
  formLabel: {
    fontFamily: rubik,
    fontWeight: 700,
    fontSize: '20px',
    lineHeight: 'normal',
  },
  ctaLabel: {
    fontFamily: rubik,
    fontWeight: 400,
    fontSize: '20px',
    lineHeight: 'normal',
    letterSpacing: '-0.02em',
  },
  navTab: {
    fontFamily: rubik,
    fontWeight: 700,
    fontSize: '14px',
    lineHeight: 'normal',
    letterSpacing: '-0.02em',
  },
  headingSm: {
    fontFamily: poppins,
    fontWeight: 600,
    fontSize: '16px',
    lineHeight: 'normal',
  },
  headingMd: {
    fontFamily: poppins,
    fontWeight: 600,
    fontSize: '20px',
    lineHeight: 'normal',
  },
  headingLg: {
    fontFamily: poppins,
    fontWeight: 600,
    fontSize: '24px',
    lineHeight: 'normal',
  },
  statusLabel: {
    fontFamily: poppins,
    fontWeight: 500,
    fontSize: '18px',
    lineHeight: 'normal',
  },
  smallBodyText: {
    fontFamily: rubik,
    fontWeight: 400,
    fontSize: '14px',
    lineHeight: 'normal',
  },
  // headingMd at 700 — the worked-example panel headings ("Example 1") sit one
  // weight above the surrounding headingMd section titles.
  headingMdBold: {
    fontFamily: poppins,
    fontWeight: 700,
    fontSize: '20px',
    lineHeight: 'normal',
  },
  // The "Step N" pill. Sits between smallBodyText (14) and microLabel (12);
  // named here because StepChip previously inlined the family/size/weight,
  // the one place in the styled layer that bypassed the type scale.
  stepChipLabel: {
    fontFamily: rubik,
    fontWeight: 400,
    fontSize: '13px',
    lineHeight: 'normal',
  },
  // Rubik 500 without the tracking the buttonLabel pair carries: panel and
  // card labels ("Equation", "Ask students", a teaching-note heading).
  rubikLabel: {
    fontFamily: rubik,
    fontWeight: 500,
    fontSize: '16px',
    lineHeight: 'normal',
  },
  rubikLabelSm: {
    fontFamily: rubik,
    fontWeight: 500,
    fontSize: '14px',
    lineHeight: 'normal',
  },
  // The "FINAL:" summary closing each worked example. Rendered uppercase by
  // the component, so the copy itself stays natural-case.
  outcomeLabel: {
    fontFamily: poppins,
    fontWeight: 700,
    fontSize: '12px',
    lineHeight: 'normal',
    letterSpacing: '0.5px',
  },
};

// Breakpoints match central_v2 so ScreenSize bands line up across the apps:
// SMALL < 700 | MEDIUM 700-1023 | LARGE >= 1024. The landing page's three
// Figma frames (393 / 744 / 1920) land one per band.
const xs = 0;
const sm = 400;
const md = 700;
const lg = 1024;
const xl = 1536;

const sizing = {
  space0: 4,
  space1: 8,
  space2: 12,
  space3: 16,
  space4: 20,
  space5: 24,
  space6: 32,
  space7: 40,
  space8: 48,
  space9: 52,
  space10: 56,
  space11: 64,
  space12: 80,
  space13: 100,
  space14: 120,
  headerHeight: 134,
  authCardMaxWidth: 400,
  // Landing page shell: Figma frame is 1920 with header/footer content inset to
  // x 260..1660 (1400) but the body sections inset to x 275..1645 (1370).
  contentMaxWidth: 1400,
  sectionMaxWidth: 1370,
  // In-app screens sit in a narrower column than the landing page: the Figma
  // card row is 344 x 3 with the gap tokenised to space8, so 344*3 + 48*2.
  appContentMaxWidth: 1128,
  // Home is its own column: Figma splits 858 into 357 chips + 98 + 403 select.
  // The stepper and banner deliberately break out of that column.
  homeContentMaxWidth: 858,
  stepperMaxWidth: 1050,
  bannerMaxWidth: 770,
  // Figma corner radii, shared by the step panel, step cards and video card.
  sectionRadius: 32,
  heroImageRadius: 37,
};

const borderWidth = 1;
const borders = {
  borderWidth,
  solid: `${borderWidth}px solid ${designSystemColors.foreground.accentBlue}`,
  subtle: `${borderWidth}px solid ${designSystemColors.foreground.greyAccent}`,
  faintNavy: `${borderWidth}px solid ${designSystemColors.foreground.fadedAtlanticNavy}`,
  transparent: `${borderWidth}px solid transparent`,
};

declare module '@mui/material/styles' {
  interface Theme {
    sizing: typeof sizing;
    borders: typeof borders;
  }

  interface ThemeOptions {
    sizing?: typeof sizing;
    borders?: typeof borders;
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
    navTitle: CSSProperties;
    navTitle2: CSSProperties;
    smallTitle: CSSProperties;
    paragraph1: CSSProperties;
    paragraph2: CSSProperties;
    footer: CSSProperties;
    uploadLabel: CSSProperties;
    submissionLabel: CSSProperties;
    placeholderLabel: CSSProperties;
    mediumLabel: CSSProperties;
    bodyText: CSSProperties;
    smallPopupLabel: CSSProperties;
    titleLight: CSSProperties;
    xsLabel: CSSProperties;
    microLabel: CSSProperties;
    appTitle: CSSProperties;
    rubikBody: CSSProperties;
    rubikBodyBold: CSSProperties;
    rubikSubBold: CSSProperties;
    buttonLabel: CSSProperties;
    buttonLabelSm: CSSProperties;
    buttonLabelSmLight: CSSProperties;
    stepLabel: CSSProperties;
    stepNumber: CSSProperties;
    formLabel: CSSProperties;
    ctaLabel: CSSProperties;
    planSubheading: CSSProperties;
    navTab: CSSProperties;
    headingSm: CSSProperties;
    headingMd: CSSProperties;
    headingLg: CSSProperties;
    statusLabel: CSSProperties;
    smallBodyText: CSSProperties;
    headingMdBold: CSSProperties;
    rubikLabel: CSSProperties;
    rubikLabelSm: CSSProperties;
    stepChipLabel: CSSProperties;
    outcomeLabel: CSSProperties;
  }

  interface TypographyVariantsOptions {
    designSystem?: typeof designSystemTypography;
    title?: CSSProperties;
    navTitle?: CSSProperties;
    navTitle2?: CSSProperties;
    smallTitle?: CSSProperties;
    paragraph1?: CSSProperties;
    paragraph2?: CSSProperties;
    footer?: CSSProperties;
    uploadLabel?: CSSProperties;
    submissionLabel?: CSSProperties;
    placeholderLabel?: CSSProperties;
    mediumLabel?: CSSProperties;
    bodyText?: CSSProperties;
    smallPopupLabel?: CSSProperties;
    titleLight?: CSSProperties;
    xsLabel?: CSSProperties;
    microLabel?: CSSProperties;
    appTitle?: CSSProperties;
    rubikBody?: CSSProperties;
    rubikBodyBold?: CSSProperties;
    rubikSubBold?: CSSProperties;
    buttonLabel?: CSSProperties;
    buttonLabelSm?: CSSProperties;
    buttonLabelSmLight?: CSSProperties;
    stepLabel?: CSSProperties;
    stepNumber?: CSSProperties;
    formLabel?: CSSProperties;
    ctaLabel?: CSSProperties;
    planSubheading?: CSSProperties;
    navTab?: CSSProperties;
    headingSm?: CSSProperties;
    headingMd?: CSSProperties;
    headingLg?: CSSProperties;
    statusLabel?: CSSProperties;
    smallBodyText?: CSSProperties;
    headingMdBold?: CSSProperties;
    rubikLabel?: CSSProperties;
    rubikLabelSm?: CSSProperties;
    stepChipLabel?: CSSProperties;
    outcomeLabel?: CSSProperties;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    title: true;
    navTitle: true;
    navTitle2: true;
    smallTitle: true;
    paragraph1: true;
    paragraph2: true;
    footer: true;
    uploadLabel: true;
    submissionLabel: true;
    placeholderLabel: true;
    mediumLabel: true;
    bodyText: true;
    smallPopupLabel: true;
    titleLight: true;
    xsLabel: true;
    microLabel: true;
    appTitle: true;
    rubikBody: true;
    rubikBodyBold: true;
    rubikSubBold: true;
    buttonLabel: true;
    buttonLabelSm: true;
    buttonLabelSmLight: true;
    stepLabel: true;
    stepNumber: true;
    formLabel: true;
    ctaLabel: true;
    planSubheading: true;
    navTab: true;
    headingSm: true;
    headingMd: true;
    headingLg: true;
    statusLabel: true;
    smallBodyText: true;
    headingMdBold: true;
    rubikLabel: true;
    rubikLabelSm: true;
    stepChipLabel: true;
    outcomeLabel: true;
  }
}

const Theme = createTheme({
  breakpoints: {
    values: { xs, sm, md, lg, xl },
  },
  sizing,
  borders,
  palette: {
    primary: {
      main: designSystemColors.surface.atlanticNavy,
      contrastText: designSystemColors.surface.white,
    },
    secondary: {
      main: designSystemColors.surface.darkBlue,
      contrastText: designSystemColors.surface.white,
    },
    background: {
      default: designSystemColors.background.offWhite,
      paper: designSystemColors.foreground.base,
    },
    text: {
      primary: designSystemColors.surface.atlanticNavy,
      secondary: designSystemColors.surface.ashyGray,
      disabled: designSystemColors.surface.placeholderGrey,
    },
    divider: designSystemColors.foreground.greyAccent,
    action: {
      disabledBackground: designSystemColors.surface.neutralGray,
    },
    success: { main: designSystemColors.status.success },
    error: { main: designSystemColors.status.errorStroke },
    info: { main: designSystemColors.status.uploadingIcon },
    designSystem: designSystemColors,
  },
  components: {
    MuiTypography: {
      defaultProps: {
        variantMapping: {
          title: 'h1',
          navTitle: 'h2',
          navTitle2: 'h2',
          smallTitle: 'h3',
          titleLight: 'h3',
          paragraph1: 'p',
          paragraph2: 'p',
          footer: 'p',
          uploadLabel: 'p',
          submissionLabel: 'p',
          placeholderLabel: 'p',
          mediumLabel: 'p',
          bodyText: 'p',
          smallPopupLabel: 'p',
          xsLabel: 'p',
          microLabel: 'p',
          appTitle: 'p',
          rubikBody: 'p',
          rubikBodyBold: 'p',
          rubikSubBold: 'p',
          buttonLabel: 'p',
          buttonLabelSm: 'p',
          buttonLabelSmLight: 'p',
          stepLabel: 'p',
          stepNumber: 'p',
          formLabel: 'p',
          ctaLabel: 'p',
          planSubheading: 'p',
          navTab: 'p',
          headingSm: 'p',
          headingMd: 'p',
          headingLg: 'p',
          statusLabel: 'p',
          smallBodyText: 'p',
          headingMdBold: 'p',
          rubikLabel: 'p',
          rubikLabelSm: 'p',
          stepChipLabel: 'p',
          outcomeLabel: 'p',
        },
      },
    },
  },
  typography: {
    fontFamily: poppins,
    designSystem: designSystemTypography,
    title: { ...designSystemTypography.title },
    navTitle: { ...designSystemTypography.navTitle },
    navTitle2: { ...designSystemTypography.navTitle2 },
    smallTitle: { ...designSystemTypography.smallTitle },
    paragraph1: { ...designSystemTypography.paragraph1 },
    paragraph2: { ...designSystemTypography.paragraph2 },
    footer: { ...designSystemTypography.footer },
    uploadLabel: { ...designSystemTypography.uploadLabel },
    submissionLabel: { ...designSystemTypography.submissionLabel },
    placeholderLabel: { ...designSystemTypography.placeholderLabel },
    mediumLabel: { ...designSystemTypography.mediumLabel },
    bodyText: { ...designSystemTypography.bodyText },
    smallPopupLabel: { ...designSystemTypography.smallPopupLabel },
    titleLight: { ...designSystemTypography.titleLight },
    xsLabel: { ...designSystemTypography.xsLabel },
    microLabel: { ...designSystemTypography.microLabel },
    appTitle: { ...designSystemTypography.appTitle },
    rubikBody: { ...designSystemTypography.rubikBody },
    rubikBodyBold: { ...designSystemTypography.rubikBodyBold },
    rubikSubBold: { ...designSystemTypography.rubikSubBold },
    buttonLabel: { ...designSystemTypography.buttonLabel },
    buttonLabelSm: { ...designSystemTypography.buttonLabelSm },
    buttonLabelSmLight: { ...designSystemTypography.buttonLabelSmLight },
    stepLabel: { ...designSystemTypography.stepLabel },
    stepNumber: { ...designSystemTypography.stepNumber },
    formLabel: { ...designSystemTypography.formLabel },
    ctaLabel: { ...designSystemTypography.ctaLabel },
    planSubheading: { ...designSystemTypography.planSubheading },
    navTab: { ...designSystemTypography.navTab },
    headingSm: { ...designSystemTypography.headingSm },
    headingMd: { ...designSystemTypography.headingMd },
    headingLg: { ...designSystemTypography.headingLg },
    statusLabel: { ...designSystemTypography.statusLabel },
    smallBodyText: { ...designSystemTypography.smallBodyText },
    headingMdBold: { ...designSystemTypography.headingMdBold },
    rubikLabel: { ...designSystemTypography.rubikLabel },
    rubikLabelSm: { ...designSystemTypography.rubikLabelSm },
    stepChipLabel: { ...designSystemTypography.stepChipLabel },
    outcomeLabel: { ...designSystemTypography.outcomeLabel },
    h1: { ...designSystemTypography.h1 },
    h2: { ...designSystemTypography.h2 },
    h3: { ...designSystemTypography.h3 },
    h4: { ...designSystemTypography.h4 },
    h5: { ...designSystemTypography.smallPopupLabel },
    h6: { ...designSystemTypography.smallBodyText },
    body1: { ...designSystemTypography.bodyText },
    body2: { ...designSystemTypography.smallBodyText },
    caption: { ...designSystemTypography.xsLabel },
    button: {
      ...designSystemTypography.h4,
      textTransform: 'none',
    },
  },
});

export { designSystemColors, designSystemTypography };
export default Theme;
