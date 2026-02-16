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
  Tooltip,
  TooltipProps,
  tooltipClasses,
} from '@mui/material';
import { ScreenSize } from '../CentralModels';
import mathSymbolsBackground from '../../images/mathSymbolsBackground.svg';

// Create Game Page Components
export const CreateGameMainContainer = styled(Box, {
  shouldForwardProp: (prop: string) =>
    prop !== 'screenSize',
})<CreateGameBoxContainerProps>(({ screenSize, theme }) => ({
  position: 'relative',
  width: '100%',
  height: '100%',
  flexGrow: 1,
  minHeight: 0,
  overflow: 'auto',
  '&::-webkit-scrollbar': {
    // Chrome and Safari
    display: 'none',
  },
  scrollbarWidth: 'none', // Firefox
  msOverflowStyle: 'none',
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  paddingLeft: screenSize !== ScreenSize.LARGE ? `${theme.sizing.mdPadding}px` : `${theme.sizing.xLgPadding}px`,
  paddingRight: screenSize !== ScreenSize.LARGE ? `${theme.sizing.mdPadding}px` : `${theme.sizing.xLgPadding}px`,
  paddingTop: screenSize !== ScreenSize.LARGE ? `0px` : `${theme.sizing.mdPadding}px`,
  gap: `${theme.sizing.mdPadding}px`,
}));

export const CreateGameContentContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  flexGrow: 1,
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  gap: `${theme.sizing.mdPadding}px`,
  height: '100%',
  overflow: 'auto',
  '&::-webkit-scrollbar': {
    // Chrome and Safari
    display: 'none',
  },
  scrollbarWidth: 'none', // Firefox
  msOverflowStyle: 'none', // IE and Edge
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

type CreateGameBoxContainerProps = {
  screenSize: ScreenSize;
};

export const CreateGameBoxContainer = styled(Box, {
  shouldForwardProp: (prop: string) =>
    prop !== 'screenSize',
})<CreateGameBoxContainerProps>(({ screenSize, theme }) => ({
  width: '100%',
  height: 'fit-content',
  display: 'flex',
  flexDirection: screenSize !== ScreenSize.LARGE ? 'column' : 'row',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  gap: `60px`,
  zIndex: 1,
  position: 'relative',
  boxSizing: 'border-box',
  paddingBottom: `${theme.sizing.xLgPadding}px`,
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
  }),
);

export const HeaderText = styled(Typography)(({ theme }) => ({
  fontSize: '14px',
  fontWeight: '400',
  lineHeight: '20px',
  fontFamily: 'Rubik',
  color: '#384466',
}));

export const QuestionHeaderText = styled(Typography)(({ theme }) => ({
  fontSize: '24px',
  fontWeight: 'bold',
  lineHeight: '32px',
  fontFamily: 'Poppins',
  color: '#384466',
}));

export const QuestionBodyText = styled(Typography)(({ theme }) => ({
  fontSize: '16px',
  fontWeight: '600',
  fontFamily: 'Poppins',
  textAlign: 'center',
  color: '#384466',
}));

export const GameCardBaseItem = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  gap: `${theme.sizing.smPadding}px`,
}));

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
      justifyContent: 'center',
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
  }),
}));

export const CreateGameGridContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  alignItems: 'flex-start',
  gap: `60px`,
}));

type QuestionCountButtonProps = {
  isDisabled: boolean;
};

export const QuestionCountButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'disabled',
})<QuestionCountButtonProps>(({ theme, isDisabled }) => ({
  backgroundColor: '#02215f',
  height: '40px',
  width: 'fit-content',
  minWidth: '40px',
  fontSize: '16px',
  fontWeight: 600,
  borderRadius: '8px',
  paddingTop: '8px',
  paddingBottom: '8px',
  paddingLeft: '10px',
  paddingRight: '10px',
  opacity: isDisabled ? 0.3 : 1,
  color: '#fffff',
  '&:hover': {
    backgroundColor: '#3155c7',
  },
  display: 'flex',
  gap: '10px',
}));

export const CreateGameSaveDiscardGridItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'flex-start',
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
  alignItems: 'center',
  gap: `${theme.sizing.xLgPadding}px`,
}));

export const GameCreateButtonStack = styled(Stack)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '8px',
}));

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
  fontSize: '20px',
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

export const CreateGameTextFieldContainer = styled(TextField, {
  shouldForwardProp: (prop) => prop !== 'isTitle',
})<GameTextFieldContainer>(({ theme, isTitle, isCardError }) => ({
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
    ...(isTitle && {
      padding: '12px 10px',
      fontSize: '16px',
    }),
    color: '#384466',
    opacity: 1,
    '&::placeholder': {
      color: isCardError ? '#D0254D' : '#384466',
      opacity: isCardError ? 1 : 0.5,
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
  borderRadius: '8px',
  height: '40px',
  width: '40px',
  color: theme.palette.primary.main,
}));

interface ContentContainerProps {
  screenSize: ScreenSize;
}
export const GameContentContainerStyled = styled(Box)<ContentContainerProps>(
  ({ theme, screenSize }) => ({
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    gap:
      `${theme.sizing.mdPadding}px`,
  }),
);

type SelectLabelProps = {
  error: boolean;
  isSelected: boolean;
};

export const SelectPhaseLabel = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'error',
})<SelectLabelProps>(({ theme, error, isSelected }) => ({
  color: error ? '#D0254D' : theme.palette.primary.sliderBlue,
  fontFamily: 'Rubik',
  fontSize: 14,
  fontWeight: 'bold',
  margin: 0,
}));

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
`;

interface FadeInProps {
  visible: boolean;
  delay?: number;
  yAxis?: number;
}

export const StyledFadeIn = styled(Box, {
  shouldForwardProp: (prop) =>
    prop !== 'visible' && prop !== 'delay' && prop !== 'yAxis',
})<FadeInProps>(({ visible, delay, yAxis }) => ({
  opacity: 0,
  transform: `translateY(${yAxis ? `${yAxis}px` : '20px'})`,
  transition: `opacity 0.5s ease-in-out ${delay}s, transform 0.5s ease-in-out ${delay}s`,
  ...(visible
    ? {
        animation: `${fadeIn} 0.5s ${delay}s forwards`,
      }
    : {
        animation: `${fadeOut} 0.5s ${delay}s forwards`,
      }),
}));

export const TooltipStyled = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: `${theme.palette.primary.sliderBlue} !important`, // Ensures the background applies
    color: `${theme.palette.primary.main} !important`, // Ensures text remains white
    fontSize: '12px',
    padding: '4px 8px',
    borderRadius: '8px',
    maxWidth: '250px',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
    marginRight: '23px !important',
    '& .MuiTooltip-arrow': {
      color: `${theme.palette.primary.sliderBlue} !important`, // Ensures arrow color matches the tooltip
    },
  },
}));

export const CustomTooltip = styled(Tooltip)({
  '& .MuiTooltip-tooltip': {
    backgroundColor: '#02215F !important', // Ensures the background applies
    color: '#FFFFFF !important', // Ensures text remains white
    fontSize: '14px',
    padding: '10px 15px',
    borderRadius: '8px',
    maxWidth: '250px',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
  },
  '& .MuiTooltip-arrow': {
    color: '#02215F !important', // Ensures arrow color matches the tooltip
  },
});