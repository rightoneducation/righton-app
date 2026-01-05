import { TextField, Typography, Button, Switch, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import mathSymbolsBackground from '../images/mathSymbolsBackground.svg';

export const StyledTextField = styled(TextField)(({ theme }) => ({
  width: '100%',
  margin: 0,
  padding: 0,
  boxSizing: 'border-box',
  borderRadius: `${theme.sizing.xSmPadding}px`,
  backgroundColor: '#FFFFFF',
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderWidth: `2px`,
      borderColor: `${theme.palette.primary.grey}`,
      borderRadius: `${theme.sizing.xSmPadding}px`,
    },
    '&.Mui-focused fieldset': {
      borderWidth: `2px`,
      borderColor: `${theme.palette.primary.grey}`,
    },
    '&:hover fieldset': {
      borderWidth: `2px`,
      borderColor: `${theme.palette.primary.extraDarkGrey}`,
    },
    '&.Mui-error fieldset': {
      borderWidth: '2px',
      borderColor: theme.palette.primary.errorBorder,
    },
  },
  '& .MuiInputBase-input': {
    color: '#384466',
    '&::placeholder': {
      color: '#384466',
    },
    '&:focus': {
      color: '#384466',
      opacity: 1,
    },
    '&:focus::placeholder': {
      color: '#384466',
      opacity: 1,
    },
  },
}));

export const StyledTitleText = styled(Typography)(({ theme }) => ({
  width: '100%',
  gap: `${theme.sizing.xSmPadding}px`,
  fontFamily: 'Poppins',
  fontWeight: '700',
  fontSize: '32px',
  lineHeight: '48px',
  color: `${theme.palette.primary.darkBlue}`,
  display: '-webkit-box',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 1,
}));

export const StyledSubtitleText = styled(Typography)(({ theme }) => ({
  fontFamily: 'Poppins',
  fontWeight: 'bold',
  fontSize: '20px',
  lineHeight: '30px',
  color: `${theme.palette.primary.darkBlue}`,
}));

export const StyledButton = styled(Button)(({ theme }) => ({
  width: '120px',
  height: '38px',
  padding: '24px',
  borderRadius: `${theme.sizing.xSmPadding}px`,
  textTransform: 'none',
  boxShadow: '0px 5px 22px 0px rgba(71, 217, 255, 0.15)',
  backgroundColor: theme.palette.primary.buttonPrimaryDefault,
  color: '#FFFFFF',
  boxSizing: 'border-box',
  pointerEvents: 'auto',
  '&:hover': {
    backgroundColor: theme.palette.primary.buttonPrimaryHover,
  },
  '&:disabled': {
    backgroundColor: theme.palette.primary.buttonPrimaryDisable,
  },
}));

export const StyledSwitch = styled(Switch)(({ theme }) => ({ // eslint-disable-line
  padding: 8,
  '& .MuiSwitch-track': {
    borderRadius: 22 / 2,
    backgroundColor: '#CCCCCC',
    opacity: 1,
    '&::before, &::after': {
      content: '""',
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      width: 16,
      height: 16,
    },
    '&::before': {
      left: 12,
    },
    '&::after': {
      right: 12,
    },
  },
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: '#FFFFFF',
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: '#FFFFFF',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
    width: 16,
    height: 16,
    margin: 2,
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: theme.palette.primary.green,
    opacity: 1,
  },
}));

export const CreateGameMainContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100vw',
  height: '100vh',
  overflow: 'hidden',
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  paddingLeft: `${theme.sizing.xLgPadding}px`,
  paddingRight: `${theme.sizing.xLgPadding}px`,
  paddingTop: `${theme.sizing.mdPadding}px`,
  paddingBottom: `${theme.sizing.mdPadding}px`,
  gap: `${theme.sizing.mdPadding}px`,
}));

export const CreateGameBackground = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  opacity: 0.1,
  display: 'flex',
  zIndex: 0,
  backgroundColor: `${theme.palette.primary.creamBackgroundColor}`,
  backgroundImage: `
    linear-gradient(180deg, rgb(255, 251, 246) 0%, rgba(254, 251, 247, 0) 100%),
    url(${mathSymbolsBackground})
  `,
  backgroundSize: 'cover, contain',
  overflow: 'hidden',
}));