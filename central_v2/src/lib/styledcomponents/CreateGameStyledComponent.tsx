import React from 'react';
import {
  Box,
  Grid,
  TextField,
  Paper,
  Button,
  styled,
  IconButton,
  Typography,
  Stack,
  keyframes,
} from '@mui/material';
import { ScreenSize } from '../CentralModels';
import mathSymbolsBackground from '../../images/mathSymbolsBackground.svg';


// Create Game Page Components
export const CreateGameMainContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  overflow: 'auto',
  '&::-webkit-scrollbar': {
    // Chrome and Safari
    display: 'none',
  },
  scrollbarWidth: 'none', // Firefox
  '-ms-overflow-style': 'none',
  boxSizing: 'border-box',
}));

export const CreateGameBackground = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  opacity: 0.1,
  position: 'absolute',
  zIndex: 0,
  backgroundColor: `${theme.palette.primary.creamBackgroundColor}`,
  backgroundImage: `
    linear-gradient(180deg, rgb(254, 251, 247) 0%, rgba(254, 251, 247, 0) 100%),
    url(${mathSymbolsBackground})
  `,
}));

export const CreateGameBoxContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
  gap: `${theme.sizing.lgPadding}px`,
  zIndex: 1,
  position: 'relative',
  paddingLeft: `${theme.sizing.mdPadding}px`,
  paddingRight: `${theme.sizing.mdPadding}px`,
  boxSizing: 'border-box',
}));

type TitleTextProps = {
  screenSize: ScreenSize;
};

export const TitleText = styled(Typography)<TitleTextProps>(
  ({ theme, screenSize }) => ({
    lineHeight: screenSize === ScreenSize.SMALL ? '36px' : '60px',
    fontFamily: 'Poppins',
    fontWeight: '700',
    fontSize:
      screenSize === ScreenSize.SMALL ? `${theme.sizing.mdPadding}px` : '40px',
    color: `${theme.palette.primary.extraDarkBlue}`,
    paddingTop: `${theme.sizing.lgPadding}px`,
  }),
);

type SaveDiscardContainerProps = {
  screenSize: ScreenSize;
};

export const CreateGameSaveDiscardBoxContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'screenSize',
})<SaveDiscardContainerProps>(({ theme, screenSize }) => ({
  ...(screenSize !== ScreenSize.SMALL &&
    screenSize !== ScreenSize.MEDIUM && {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-Start',
      alignItems: 'center',
      gap: `${theme.sizing.xSmPadding}px`,
      paddingRight: '30px',
    }),
  ...((screenSize === ScreenSize.MEDIUM || screenSize === ScreenSize.SMALL) && {
    width: '100%',
    maxWidth: '672px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: `${theme.sizing.xSmPadding}px`,
    paddingBottom: '16px',
  }),
}));

export const CreateGameGridContainer = styled(Grid)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
}));

type QuestionCountButtonProps = {
  isDisabled: boolean;
};

export const QuestionCountButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'disabled',
})<QuestionCountButtonProps>(({ theme, isDisabled }) => ({
  backgroundColor: '#02215f',
  height: '38px',
  width: '119px',
  borderRadius: '8px',
  padding: '8px',
  opacity: isDisabled ? 0.3 : 1,
  color: '#fffff',
  '&:hover': {
    backgroundColor: '#3155c7',
  },
}));

export const CreateGameSaveDiscardGridItem = styled(Grid)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'flex-start',
  paddingTop: '16px',
  gap: '20px',
}));

type CreateGameCardGridItemProps = { screenSize: ScreenSize };

export const CreateGameCardGridItem = styled(Grid, {
  shouldForwardProp: (prop) => prop !== 'screenSize',
})<CreateGameCardGridItemProps>(({ theme, screenSize }) => ({
  width: '100%',
  maxWidth: '672px',
  minWidth: screenSize !== ScreenSize.SMALL ? '672px' : '0px',
  display: 'flex',
  flexDirection: 'column',
  gap: `${theme.sizing.xLgPadding}px`,
}));

export const GameCreateButtonStack = styled(Stack)(({theme}) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '8px'
}))

// CardBase Styled Component
type ImagePlaceholderProps = {
  isCardErrored: boolean;
};

export const ImagePlaceholder = styled(Box)<ImagePlaceholderProps>(
  ({ theme, isCardErrored }) => ({
    width: '100%',
    background: `${theme.palette.primary.uploadLightGrey}`,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '10px',
    border: isCardErrored
      ? `2px solid ${theme.palette.primary.errorBorder}`
      : `2px solid ${theme.palette.primary.uploadDarkGrey}`,
    borderRadius: '8px',
    boxSizing: 'border-box',
  }),
);

interface CreateGameTitleBarStyledProps {
  screenSize: ScreenSize;
}

export const CreateGameTitleBarStyled = styled(
  Box,
)<CreateGameTitleBarStyledProps>(({ theme, screenSize }) => ({
  width: '100%',
  height: 'fit-content',
  display: 'flex',
  flexDirection: screenSize === ScreenSize.SMALL ? 'column' : 'row',
  justifyContent: 'space-between',
  alignItems: screenSize === ScreenSize.SMALL ? 'flex-start' : 'center',
  gap:
    screenSize === ScreenSize.SMALL
      ? `${theme.sizing.xSmPadding}px`
      : `${theme.sizing.smPadding}px`,
}));

export const CreateGameTitleText = styled(Typography)(({ theme }) => ({
  fontSize: '24px',
  lineHeight: '30px',
  fontWeight: 700,
  color: '#000',
}));

export const CreateGameContentLeftContainerStyled = styled(Box)(
  ({ theme }) => ({
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: `12px`,
  }),
);

type GameTextFieldContainer = { isTitle?: boolean; isCardError: boolean };

export const 
CreateGameTextFieldContainer = styled(TextField, {
  shouldForwardProp: (prop) => prop !== 'isTitle',
})<GameTextFieldContainer>(({ theme, isTitle, isCardError }) => ({
  width: '100%',
  margin: 0,
  padding: 0,
  boxSizing: 'border-box',
  borderRadius: `${theme.sizing.xSmPadding}px`,
  backgroundColor: '#FFFFFF', // Set background color to white
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderWidth: `2px`,
      borderColor: `${theme.palette.primary.grey}`,
      borderRadius: `${theme.sizing.xSmPadding}px`,
    },
    '&.Mui-focused fieldset': {
      borderWidth: `2px`,
      borderColor:`${theme.palette.primary.grey}`,
    },
    '&:hover fieldset': {
      borderWidth: `2px`,
      borderColor:`${theme.palette.primary.extraDarkGrey}`,
    },
    '&.Mui-error fieldset': {
      borderWidth: '2px',
      borderColor: theme.palette.primary.errorBorder,
    },
  },
  '& .MuiInputBase-input': {
    ...(isTitle && {
      padding: '12px 10px',
      fontSize: '20px',
      fontWeight: 'bold',
    }),
    color: '#384466',
    opacity: isCardError ? 1 : 0.5,
    '&::placeholder': {
        color: isCardError ? '#D0254D': '#384466',
        opacity: isCardError ? 1 : 0.5
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

export const AddMoreIconButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: '#02215f',
  '&:hover': { backgroundColor: '#4056ca' },
  borderRadius: '20%',
}));

interface ContentContainerProps {
  screenSize: ScreenSize;
}
export const GameContentContainerStyled = styled(Box)<ContentContainerProps>(({ theme, screenSize }) => ({
  width: '100%',
  height: screenSize === ScreenSize.SMALL ? '100%' : '100%',
  display: 'flex',
  flexDirection: screenSize === ScreenSize.SMALL ? 'column' : 'row',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: screenSize === ScreenSize.SMALL ? '12px': `${theme.sizing.smPadding}px`,
}));

export const SelectPhaseLabel = styled(Typography)(({theme}) => ({
    color: theme.palette.primary.sliderBlue,
    fontFamily: theme.typography.fontFamily,
    fontSize: '16px',
    fontWeight: 600,
    margin: 0,
}))


const fadeIn = keyframes`
from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeOut = keyframes`
 from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(10px);
  }
`

interface FadeInProps {
  visible: boolean;
  delay?: number;
  yAxis?: number;
}

export const StyledFadeIn = styled(Box, {
  shouldForwardProp: (prop) =>
    prop !== "visible" && prop !== "delay" && prop !== "yAxis",
})<FadeInProps>(({ visible, delay, yAxis }) => ({
  opacity: 0,
  transform: `translateY(${yAxis ? `${yAxis}px` : "20px"})`,
  transition: `opacity 0.5s ease-in-out ${delay}s, transform 0.5s ease-in-out ${delay}s`,
  ...(visible ? {
    animation: `${fadeIn} 0.5s ${delay}s forwards`,
  }: {
    animation: `${fadeOut} 0.5s ${delay}s forwards`,
  }),
}));