import React from 'react';
import { Box, Tabs, styled } from '@mui/material';
import { ContentFrame } from './QuestionTabsStyledComponents';
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

export const CCSSContentFrame = styled(Box)(({theme}) => ({ // eslint-disable-line
  boxSizing: 'border-box',
  height: '300px',
  minWidth: '672px',
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