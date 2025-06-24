import { Box, Grid, styled, Tab } from '@mui/material';
import { ScreenSize } from '../CentralModels';
import mathSymbolsBackground from '../../images/mathSymbolsBackground.svg';

export const TabContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  height: '100%',
  width: '100%',
  zIndex: 7,
  overflow: 'hidden',
  pointerEvents: 'none',
}));

export const ModalBackground = styled(Box)(({ theme }) => ({
  position: 'relative',
  top: 0,
  height: '100%',
  width: '100%',
  background: 'rgba(0,0,0,0.5)',
  zIndex: 5,
}));

export const ContentFrame = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  paddingTop: '32px',
  paddingLeft: '32px',
  paddingRight: '32px',
  boxSizing: 'border-box',
  width: '100%',
  height: '100%',
}));

export const TabContent = styled(Box)(({ theme }) => ({
  position: 'relative',
  top: 0,
  height: '100%',
  width: '100%',
  zIndex: 7,
  pointerEvents: 'auto',
}));

type StyledTabProps = {
  isSelected: boolean;
};

export const StyledTab = styled(Tab, {
  shouldForwardProp: (prop) => prop !== 'isSelected',
})<StyledTabProps>(({ theme, isSelected }) => ({
  background: '#304B7F',
  color: 'rgba(255, 255, 255, 0.5)',
  minWidth: '64px',
  borderTopLeftRadius: 16,
  borderTopRightRadius: 16,
  '&.Mui-selected': {
    background: '#02215F',
    color: '#fff',
  },
  pointerEvents: 'auto',
}));

export const DetailedQuestionContainer = styled(Grid)(({ theme }) => ({
  height: '100%',
  width: '100%',
  gap: `${theme.sizing.mdPadding}px`,
  overflowY: 'auto',
  '&::-webkit-scrollbar': {
    // Chrome and Safari
    display: 'none',
  },
  scrollbarWidth: 'none', // Firefox
  '-ms-overflow-style': 'none', // IE and Edge
}));

export const ContentContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: '100%',
  width: '100%',
  zIndex: 6,
  borderTopRightRadius: '16px',
  borderBottomLeftRadius: '16px',
  borderBottomRightRadius: '16px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '24px',
  boxSizing: 'border-box',
  backgroundImage: `
  url(${mathSymbolsBackground}),
  linear-gradient(180deg, #092361 0%, #19356D 100%)
    
  `,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'bottom', 
}));

export const ScrollContainer = styled(Box)(({ theme }) => ({
  height: '100%',
  overflow: 'auto',
  '&::-webkit-scrollbar': {
    // Chrome and Safari
    display: 'none',
  },
  scrollbarWidth: 'none', // Firefox
  msOverflowStyle: 'none', // IE and Edge
}));

export const ButtonContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  paddingTop: `${theme.sizing.mdPadding}px`,
  boxSizing: 'border-box',
}));

export const ButtonContainerLeft = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
}));

export const ButtonContainerRight = styled(ButtonContainerLeft)(
  ({ theme }) => ({
    flexDirection: 'row',
  }),
);

export const CardContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '24px',
  overflowY: 'auto',
  '&::-webkit-scrollbar': {
    // Chrome and Safari
    display: 'none',
  },
  scrollbarWidth: 'none', // Firefox
  '-ms-overflow-style': 'none', // IE and Edge
  paddingTop: '24px',
}));

export const SubCardGridItem = styled(Grid)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: `${theme.sizing.smPadding}px`,
}));

interface IGridItem {
  screenSize?: ScreenSize;
}
export const GridItem = styled(Grid, {
  shouldForwardProp: (prop) => prop !== 'screenSize',
})<IGridItem>(({ theme, screenSize }) => ({
  height: '100%',
  alignItems: screenSize === ScreenSize.SMALL ? 'center' : 'normal',
  ...(screenSize !== ScreenSize.SMALL && {
    overflowY: 'auto',
  }),
  width: '100%',
  maxWidth: '672px',
  display: 'flex',
  flexDirection: 'column',
  gap: `${theme.sizing.smPadding}px`,
  '&::-webkit-scrollbar': {
    // Chrome and Safari
    display: 'none',
  },
  scrollbarWidth: 'none', // Firefox
  '-ms-overflow-style': 'none', // IE and Edge
}));
