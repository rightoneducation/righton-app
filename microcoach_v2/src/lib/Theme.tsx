import type { CSSProperties } from 'react';
import { createTheme } from '@mui/material/styles';

const rubik = "'Rubik', sans-serif";
const poppins = "'Poppins', sans-serif";

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
  },
  h1: {
    fontFamily: rubik,
    fontWeight: 500,
    fontSize: '40px',
    lineHeight: 'normal',
  },
  h2: {
    fontFamily: rubik,
    fontWeight: 500,
    fontSize: '32px',
    lineHeight: 'normal',
  },
  h3: {
    fontFamily: rubik,
    fontWeight: 600,
    fontSize: '32px',
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
    fontSize: '24px',
    lineHeight: '32px',
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
    lineHeight: 'normal',
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
};

const xs = 400;
const sm = 700;
const md = 900;
const lg = 1200;
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
  headerHeight: 64,
  footerHeight: 64,
  authCardMaxWidth: 400,
};

const borderWidth = 1;
const borders = {
  borderWidth,
  solid: `${borderWidth}px solid ${designSystemColors.foreground.accentBlue}`,
  subtle: `${borderWidth}px solid ${designSystemColors.foreground.greyAccent}`,
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
    statusLabel: CSSProperties;
    smallBodyText: CSSProperties;
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
    statusLabel?: CSSProperties;
    smallBodyText?: CSSProperties;
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
    statusLabel: true;
    smallBodyText: true;
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
          statusLabel: 'p',
          smallBodyText: 'p',
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
    statusLabel: { ...designSystemTypography.statusLabel },
    smallBodyText: { ...designSystemTypography.smallBodyText },
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
