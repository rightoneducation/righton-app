import { Box, Grid, styled, Tab } from '@mui/material';

export const TabContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  height: '100dvh',
  width: '100dvw',
  zIndex: 6,
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
  paddingTop: '115px',
  paddingLeft: '32px',
  paddingRight: '32px',
  boxSizing: 'border-box',
  height: '100%',
  width: '100%',
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

export const StyledTab = styled(Tab)<StyledTabProps>(({ theme, isSelected }) => ({
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
  width: '100%',
}));

export const ContentContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  flexGrow: 1,
  height: '100%',
  width: '100%',
  background: '#02215F',
  zIndex: 6,
  borderTopRightRadius: '16px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: `${theme.sizing.mdPadding}px`,
}));

export const ButtonContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  paddingTop: `${theme.sizing.mdPadding}px`,
  paddingLeft: `${theme.sizing.mdPadding}px`,
  paddingRight: `${theme.sizing.mdPadding}px`,
  boxSizing: 'border-box',
}));

export const ButtonContainerLeft = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: `${theme.sizing.smPadding}px`,
}));

export const ButtonContainerRight = styled(ButtonContainerLeft)(({ theme }) => ({
  flexDirection: 'row',
}));

export const CardContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  overflow: 'auto',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  paddingBottom: '100px',
  '&::-webkit-scrollbar': {
    // Chrome and Safari
    display: 'none',
  },
  scrollbarWidth: 'none', // Firefox
  '-ms-overflow-style': 'none', // IE and Edge
}));

export const SubCardGridItem = styled(Grid)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: `${theme.sizing.smPadding}px`,
}));