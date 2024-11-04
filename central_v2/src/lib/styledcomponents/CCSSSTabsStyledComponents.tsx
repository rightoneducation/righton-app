import React from 'react';
import { Box, Button, Tabs, Grid, styled, Typography } from '@mui/material';
import { ScreenSize } from '../CentralModels';

export const CCSSTabContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  height: '100dvh',
  width: '100dvw',
  zIndex: 6,
  overflow: 'hidden',
  pointerEvents: 'none',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
}));

interface CCSSContentContainerProps {
  screenSize: number;
}

export const CCSSContentContainer = styled(Box)<CCSSContentContainerProps>(({ theme, screenSize }) => ({
  position: 'relative',
  height: '100%',
  width: '100%',
  background: '#02215F',
  zIndex: 6,
  borderTopRightRadius: screenSize === ScreenSize.LARGE ? '0px' : '16px',
  borderBottomLeftRadius: '16px',
  borderBottomRightRadius: '16px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: `${theme.sizing.mdPadding}px`,
}));

interface CCSSContentFrameProps {
  screenSize: ScreenSize
}

export const CCSSContentFrame = styled(Box)<CCSSContentFrameProps>(({theme, screenSize}) => ({ // eslint-disable-line
  boxSizing: 'border-box',
  height: 'fit-content',
  width: screenSize === ScreenSize.LARGE ? '672px' : '100%',
  padding: screenSize === ScreenSize.LARGE ? '0px' : '21px'
}));

export const CCSSTabsStyled = styled(Tabs)(({ theme }) => ({
  '& .MuiTab-flexContainer':{
    gap: '18px'
  }
}));


// this is taken from https://mui.com/material-ui/react-tabs/#customization
// to be able to provide a gap between the tabs
interface CCSSStyledTabsProps {
  children?: React.ReactNode;
  value: number;
  screenSize: ScreenSize;
  onChange: (event: React.SyntheticEvent, newValue: number) => void;
}

export const CCSSStyledTabs = styled((props: CCSSStyledTabsProps) => (
  <Tabs
    variant={props.screenSize === ScreenSize.LARGE ? "fullWidth" : "standard"}
    {...props}
  />
))({
  '& .MuiTabs-indicator': {
    display: 'none'
  },
  '& .MuiTabs-flexContainer':{
    gap: '8px'
  }
});

export const CCSSPillContainer = styled(Grid)(({ theme }) => ({
  width: 'fit-content',
  height: '100%',
  overflow: 'auto',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '32px',
  '&::-webkit-scrollbar': {
    // Chrome and Safari
    display: 'none',
  },
  scrollbarWidth: 'none', // Firefox
  '-ms-overflow-style': 'none', // IE and Edge
}));

export const CCSSGridItem = styled(Grid)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));

export const GradeIndicator = styled(Button)(({ theme }) => ({
  width: 'fit-content',
  height: '38px',
  borderRadius: '54px',
  textTransform: 'none',
  boxShadow: ' 0px 5px 22px 0px rgba(71, 217, 255, 0.37)',
  paddingTop: '4px',
  paddingBottom: '4px',
  paddingLeft: '32px',
  paddingRight: '32px',
  boxSizing: 'border-box',
  background: `${theme.palette.primary.buttonGradientBlue}`,
  ':hover': {
    background: `${theme.palette.primary.buttonGradientBlue}`,
  },
  '&:disabled': {
    background: `${theme.palette.primary.buttonGradientGrey}`,
  },
}));

export const CCSSIndicatorPillText = styled(Typography)(({theme}) => ({
  fontSize: '20px',
  fontWeight: 600,
  color: '#FFF',
  width: 'fit-content',
  display: 'flex',
}));