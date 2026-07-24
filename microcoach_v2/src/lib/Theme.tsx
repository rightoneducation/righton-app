import { createTheme } from '@mui/material/styles';

// Minimal MUI theme skeleton for MicroCoach v2.
// This intentionally starts small — the design team's tokens (palette,
// gradients, custom sizing, typography scale) will be layered in here as the
// new UX is implemented, following the same `createTheme` pattern central_v2 uses.
const Theme = createTheme({
  palette: {
    primary: {
      main: '#312759',
    },
    secondary: {
      main: '#08458F',
    },
    background: {
      default: '#FEFBF7',
    },
  },
  typography: {
    fontFamily: "'Poppins', 'Karla', sans-serif",
  },
});

export default Theme;
