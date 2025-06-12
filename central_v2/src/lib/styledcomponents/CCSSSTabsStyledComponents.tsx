import React from 'react';
import { Box, Button, Tabs, Grid, styled, Typography } from '@mui/material';
import { ScreenSize } from '../CentralModels';

interface CCSSTabContainerProps {
  screenSize: ScreenSize;
}

export const CCSSTabContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'screenSize',
})<CCSSTabContainerProps>(({ theme, screenSize }) => ({
  position: 'absolute',
  top: screenSize === ScreenSize.SMALL ? '5dvh' : '15dvh',
  height: '100',
  maxHeight: '100dvh',
  width: '100dvw',
  zIndex: 1310,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
}));

interface CCSSContentContainerProps {
  screenSize: number;
}

export const CCSSContentContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'screenSize',
})<CCSSContentContainerProps>(({ theme, screenSize }) => ({
  position: 'relative',
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
  maxHeight: '50dvh',
  overflowY: 'auto',
  paddingTop: '32px',
  paddingBottom: '32px',
}));

interface CCSSContentFrameProps {
  screenSize: ScreenSize;
}

export const CCSSContentFrame = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'screenSize',
})<CCSSContentFrameProps>(({ theme, screenSize }) => ({
  // eslint-disable-line
  boxSizing: 'border-box',
  height: 'fit-content',
  width: screenSize === ScreenSize.LARGE ? '672px' : '100%',
  padding: screenSize === ScreenSize.LARGE ? '0px' : '21px',
}));

export const CCSSTabsStyled = styled(Tabs)(({ theme }) => ({
  '& .MuiTab-flexContainer': {
    gap: '18px',
  },
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
    variant={props.screenSize === ScreenSize.LARGE ? 'fullWidth' : 'standard'}
    {...props}
  />
))({
  '& .MuiTabs-indicator': {
    display: 'none',
  },
  '& .MuiTabs-flexContainer': {
    gap: '8px',
  },
});

export const CCSSPillContainer = styled(Grid)(({ theme }) => ({
  width: 'fit-content',
  maxHeight: '500px',
  overflowY: 'auto',
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
  minHeight: '38px',
  borderRadius: `${theme.sizing.xSmPadding}px`,
  textTransform: 'none',
  boxShadow: 'none',
  paddingTop: '4px',
  paddingBottom: '4px',
  paddingLeft: '32px',
  paddingRight: '32px',
  boxSizing: 'border-box',
  background: `${theme.palette.primary.buttonActionDefault}`,
  ':hover': {
    background: `${theme.palette.primary.buttonActionHover}`,
  },
  '&:disabled': {
    background: `${theme.palette.primary.buttonActionDisable}`,
  },
}));

export const CCSSIndicatorPillText = styled(Typography)(({ theme }) => ({
  fontSize: '20px',
  fontWeight: 600,
  color: '#FFF',
  width: 'fit-content',
  display: 'flex',
}));

export const CCSSIndicatorDescText = styled(Typography)(({ theme }) => ({
  fontSize: '16px',
  fontWeight: 400,
  color: '#FFF',
  width: 'fit-content',
  display: 'flex',
  textAlign: 'left',
}));
