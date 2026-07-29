import type { CSSProperties } from 'react';
import { createTheme } from '@mui/material/styles';

// ============================================================================
// MicroCoach v2 design system.
//
// Structure mirrors networking/src/DesignSystem/Theme.tsx (token objects ->
// module augmentation -> createTheme) but carries one theme instead of two and
// skips the play/host/Victory-chart specifics.
//
// Every value below is a PLACEHOLDER. The shape is what matters: when design
// hands over real tokens they overwrite values in place, and no structural or
// type work is needed. Placeholders are deliberately loud (magenta accent) so
// unfinished surfaces are obvious on screen.
// ============================================================================

// design tokens - font families:
const primaryFont = "'Poppins', sans-serif";

// design tokens - colors: (comments = intended usage)
const designSystemColors = {
  background: {
    base: '#FFFFFF', // use case: page background
    subtle: '#F4F4F4', // use case: page background, secondary sections
  },
  foreground: {
    base: '#111111', // use case: body text
    muted: '#666666', // use case: secondary / helper text
    inverse: '#FFFFFF', // use case: text on accent or dark surfaces
    stroke: '#CCCCCC', // use case: borders, dividers
  },
  surface: {
    card: '#FFFFFF', // use case: card background
    raised: '#EEEEEE', // use case: hover / pressed card background
    accent: '#FF00A8', // TODO(design): placeholder brand accent
    accentAlt: '#7A00FF', // TODO(design): placeholder secondary accent
  },
  status: {
    success: '#2E7D32', // use case: confirmation
    warning: '#ED6C02', // use case: caution
    error: '#D0254D', // use case: validation failure
    info: '#0288D1', // use case: neutral notice
  },
  // angle defaulted to 180deg (top -> bottom); confirm with design.
  gradients: {
    background: 'linear-gradient(180deg, #FFFFFF 0%, #F4F4F4 100%)', // use case: page background
    accent: 'linear-gradient(180deg, #FF00A8 0%, #7A00FF 100%)', // use case: accent button, hero
  },
};

// design tokens - typography ramp:
// Weights are limited to those loaded in src/index.css (Poppins 400/500/600/700).
// Adding a weight here means adding the matching @import there, otherwise the
// browser fakes it.
const designSystemTypography = {
  title: {
    fontFamily: primaryFont,
    fontWeight: 700,
    fontSize: '32px',
    lineHeight: '130%',
    letterSpacing: 'normal',
  }, // screen / hero titles
  h1: {
    fontFamily: primaryFont,
    fontWeight: 700,
    fontSize: '24px',
    lineHeight: '130%',
    letterSpacing: 'normal',
  }, // section headers
  h2: {
    fontFamily: primaryFont,
    fontWeight: 600,
    fontSize: '20px',
    lineHeight: '24px',
    letterSpacing: 'normal',
  }, // sub-headers, button labels
  paragraph: {
    fontFamily: primaryFont,
    fontWeight: 400,
    fontSize: '16px',
    lineHeight: '150%',
    letterSpacing: 'normal',
  }, // body copy
  boldLabel: {
    fontFamily: primaryFont,
    fontWeight: 600,
    fontSize: '14px',
    lineHeight: 'normal',
    letterSpacing: 'normal',
  }, // field labels, emphasis
  smallLabel: {
    fontFamily: primaryFont,
    fontWeight: 400,
    fontSize: '12px',
    lineHeight: 'normal',
    letterSpacing: 'normal',
  }, // helper text, captions
};

// design tokens - breakpoints:
const xs = 400;
const sm = 700;
const md = 900;
const lg = 1200;
const xl = 1536;

// design tokens - sizing. NOTE: unitless numbers, so consumers must write
// `${theme.sizing.mdPadding}px`. Passing one bare into an sx spacing prop
// (p, m, gap) multiplies it by the 8px spacing unit.
const sizing = {
  headerHeight: 64,
  footerHeight: 64,
  authCardMaxWidth: 400, // widest the centered auth card grows to
  xSmPadding: 8, // icon gaps, tight text positioning
  smPadding: 16, // margins around text, spacing inside cards
  mdPadding: 24, // spacing between grouped elements
  lgPadding: 32, // card padding
  xLgPadding: 48, // spacing between card and screen edge
  xxLgPadding: 64, // spacing between major page sections
};

// design tokens - borders:
const borderWidth = 1;
const borders = {
  borderWidth,
  solid: `${borderWidth}px solid ${designSystemColors.foreground.stroke}`,
  transparent: `${borderWidth}px solid transparent`,
  semiTransparent: `${borderWidth}px solid rgba(0, 0, 0, 0.12)`,
};

// ============================================================================
// Type augmentation.
//
// Custom colors live under `palette.designSystem.*`, NOT bolted onto
// `palette.primary.*` the way networking and central_v2 do it — that is what
// forces those files to hand-maintain ~65 parallel interface keys. Typing the
// custom theme keys as `typeof <token object>` means adding a token needs no
// interface edit at all.
// ============================================================================

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
    paragraph: CSSProperties;
    boldLabel: CSSProperties;
    smallLabel: CSSProperties;
  }

  interface TypographyVariantsOptions {
    designSystem?: typeof designSystemTypography;
    title?: CSSProperties;
    paragraph?: CSSProperties;
    boldLabel?: CSSProperties;
    smallLabel?: CSSProperties;
  }
}

// Makes `<Typography variant="paragraph">` typecheck.
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    title: true;
    paragraph: true;
    boldLabel: true;
    smallLabel: true;
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
      main: designSystemColors.surface.accent,
      contrastText: designSystemColors.foreground.inverse,
    },
    secondary: {
      main: designSystemColors.surface.accentAlt,
      contrastText: designSystemColors.foreground.inverse,
    },
    background: {
      default: designSystemColors.background.base,
      paper: designSystemColors.surface.card,
    },
    text: {
      primary: designSystemColors.foreground.base,
      secondary: designSystemColors.foreground.muted,
    },
    success: { main: designSystemColors.status.success },
    warning: { main: designSystemColors.status.warning },
    error: { main: designSystemColors.status.error },
    info: { main: designSystemColors.status.info },
    designSystem: designSystemColors,
  },
  components: {
    // Without this, MUI renders unknown variants as <span> — a silent
    // semantics/a11y regression.
    MuiTypography: {
      defaultProps: {
        variantMapping: {
          title: 'h1',
          paragraph: 'p',
          boldLabel: 'p',
          smallLabel: 'p',
        },
      },
    },
  },
  typography: {
    fontFamily: primaryFont,
    designSystem: designSystemTypography,
    // custom variants
    title: {
      ...designSystemTypography.title,
      color: designSystemColors.foreground.base,
    },
    paragraph: {
      ...designSystemTypography.paragraph,
      color: designSystemColors.foreground.base,
    },
    boldLabel: {
      ...designSystemTypography.boldLabel,
      color: designSystemColors.foreground.base,
    },
    smallLabel: {
      ...designSystemTypography.smallLabel,
      color: designSystemColors.foreground.muted,
    },
    // stock MUI slots, pointed at the same ramp so untouched components
    // inherit the design system rather than MUI defaults
    h1: {
      ...designSystemTypography.title,
      color: designSystemColors.foreground.base,
    },
    h2: {
      ...designSystemTypography.h1,
      color: designSystemColors.foreground.base,
    },
    h3: {
      ...designSystemTypography.h2,
      color: designSystemColors.foreground.base,
    },
    body1: {
      ...designSystemTypography.paragraph,
      color: designSystemColors.foreground.base,
    },
    body2: {
      ...designSystemTypography.smallLabel,
      color: designSystemColors.foreground.muted,
    },
    button: {
      ...designSystemTypography.h2,
      textTransform: 'none',
    },
  },
});

// Tokens are exported for direct use outside the MUI theme (tests, storybook,
// non-MUI surfaces). `Theme` itself is default-only: adding a named `Theme`
// export alongside it trips import/no-named-as-default at the import site.
export { designSystemColors, designSystemTypography };
export default Theme;
