import { createTheme } from '@mui/material/styles';
import { ScreenSize } from './WebsiteModels';

// design tokens - colors: (comments = example usage)
const mainColor = '#FFFFFF'; // main  (ex white)
const primaryTextColor = '#FFFFFF'; // main text color
const primaryBlueColor = '#02215F'; // main background blue color
const primaryPinkColor = '#FF3A6A'; // main highlight pink color
const secondaryDarkBlueColor = 'rgba(2, 33, 95, 0.50)'; // sponsor divider background
const tertiaryDarkBlueColor = '#011849'; // about us background color
const darkGreyColor = '#CFCFCF'; // disabled pagination bullet

// design tokens - breakpoints:
const xs = 0;
const sm = 400;
const md = 700;
const lg = 1024;
const xl = 1536;

// design tokens - padding sizes
const containerPadding: Record<ScreenSize, string> = {
  [ScreenSize.LARGE]: '96px 72px',
  [ScreenSize.MEDIUM]: '60px 72px',
  [ScreenSize.SMALL]: '60px 12px',
};
const xxSmPadding = 6; // ex. pagination bullets
const xSmPadding = 10; // ex. grid spacing
const smPadding = 12; // ex. vertical padding on mobile
const mdPadding = 24; // ex. gap in flexbox
const lgPadding = 48; // ex. top padding in mobile
const xLgPadding = 72; // ex. vertical padding on tablet
const xxLgPadding = 96; // ex. vertical padding on desktop

// design tokens - misc sizing
const sponsorImageWidth = '250px'; // ex. width of sponsor images
const headerHeightMobile = '78px'; // ex. height of header
const headerHeightDesktop = '192px'; // ex. height of header


// design tokens - border sizes
const dividerBorder = '1px solid #fff';

// adds mainGradient field to the palette theme
declare module '@mui/material/styles' {
  interface Theme {
    sizing: {
      containerPadding: {
        [ScreenSize.LARGE]: string;
        [ScreenSize.MEDIUM]: string;
        [ScreenSize.SMALL]: string;
      };
      xxSmPadding: number;
      xSmPadding: number;
      smPadding: number;
      mdPadding: number;
      lgPadding: number;
      xLgPadding: number;
      xxLgPadding: number;
      sponsorImageWidth: number;
      dividerBorder: string;
      headerHeightMobile: string;
      headerHeightDesktop: string;
    };
  }

  interface ThemeOptions {
    sizing?: {
      containerPadding?: {
        [ScreenSize.LARGE]?: string;
        [ScreenSize.MEDIUM]?: string;
        [ScreenSize.SMALL]?: string;
      };
      xxSmPadding: number;
      xSmPadding: number;
      smPadding: number;
      mdPadding: number;
      lgPadding: number;
      xLgPadding: number;
      xxLgPadding: number;
      sponsorImageWidth: string;
      dividerBorder: string;
      headerHeightMobile: string;
      headerHeightDesktop: string;
    };
  }

  interface PaletteColor {
    mainColor: string;
    primaryBlue: string;
    primaryPink: string;
    secondaryDarkBlue: string;
    darkGrey: string;
    tertiaryDarkBlue: string;
  }

  interface SimplePaletteColorOptions {
    mainColor?: string;
    primaryBlue?: string;
    primaryPink?: string;
    secondaryDarkBlue?: string;
    darkGrey?: string;
    tertiaryDarkBlue?: string;
  }
}

export default createTheme({
  breakpoints: {
    values: { xs, sm, md, lg, xl },
  },
  sizing: {
    containerPadding,
    xxSmPadding,
    xSmPadding,
    smPadding,
    mdPadding,
    lgPadding,
    xLgPadding,
    xxLgPadding,
    sponsorImageWidth,
    dividerBorder,
    headerHeightMobile,
    headerHeightDesktop,
  },
  palette: {
    primary: {
      main: mainColor,
      primaryBlue: primaryBlueColor,
      primaryPink: primaryPinkColor,
      secondaryDarkBlue: secondaryDarkBlueColor,
      darkGrey: darkGreyColor,
      tertiaryDarkBlue: tertiaryDarkBlueColor,
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
      color: primaryTextColor,
    },
    h4: {
      // answer card title
      fontWeight: '700',
      fontSize: '14px',
      lineHeight: '16px',
      color: primaryTextColor,
    },
    h5: {
      // card answer list letters (A, B, C, D, etc)
      fontFamily: 'Poppins',
      fontSize: '16px',
      fontWeight: 800,
      lineHeight: '19px',
      color: primaryTextColor,
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
      color: primaryTextColor,
    },
    body1: {
      // question text
      fontWeight: '400',
      fontSize: '16px',
      lineHeight: '18px',
      color: primaryTextColor,
    },
    body2: {
      // answer text
      fontWeight: '400',
      fontSize: '18px',
      lineHeight: '22px',
      textAlign: 'left',
      color: primaryTextColor,
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
