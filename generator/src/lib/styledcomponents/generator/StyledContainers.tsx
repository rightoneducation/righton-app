import { Box, Grid, styled } from '@mui/material';
import { ScreenSize } from '../../Models';
import MathBackground from '../../../img/MathSymbolsBackground.svg';

export const MainContainer = styled(Box)(({ theme }) => ({
  height: '100vh', 
  width: '100vw', 
  backgroundColor: `#203469`,
  backgroundImage: `
    url(${MathBackground})
  `,
  backgroundSize: 'cover !important',
  display: 'flex', 
  flexDirection: 'column',
  justifyContent: 'flex-start', 
  alignItems: 'center',
  boxSizing: 'border-box',
  position: 'relative',
  gap: '36px'
}));

export const HeaderContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between', 
  alignItems: 'center',
  boxSizing: 'border-box',
  paddingLeft: `${theme.sizing.lgPadding}px`,
  paddingRight: `${theme.sizing.lgPadding}px`,
  paddingTop: `${theme.sizing.smPadding}px`,
  paddingBottom: `${theme.sizing.smPadding}px`,
  background: 'linear-gradient(to bottom, #02215F 43%, rgba(2, 33, 95, 0) 100%)'
}));

export const HeaderRightContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '24px',
  alignItems: 'center',
}));

export const HeaderButtonContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '8px',
  paddingLeft: '12px',
  paddingRight: '12px',
  cursor: 'pointer',
}));

export const TextContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex', 
  flexDirection: 'column', 
  gap: `${theme.sizing.smPadding}px`,
  alignItems: 'center',
  paddingLeft: `${theme.sizing.xLgPadding}px`,
  paddingRight: `${theme.sizing.xLgPadding}px`,
  boxSizing: 'border-box',
}));

export const CardsContainer = styled(Grid)(({ theme }) => ({ 
  maxWidth: '1013px', 
  width: '100%',
  minHeight: 0, 
  marginTop: 0,
  boxSizing: 'border-box',
  paddingLeft: `${theme.sizing.mdPadding}px`,
  paddingRight: `${theme.sizing.mdPadding}px`,
  overflow: 'auto',
  '&::-webkit-scrollbar': {
    // Chrome and Safari
    display: 'none',
  },
  scrollbarWidth: 'none', // Firefox
  '-ms-overflow-style': 'none',
}));

export const QuestionContainer = styled(Box)(({ theme }) => ({
  height: '100%',
  width: '100%',
  display: 'flex', 
  flexDirection: 'column',
  justifyContent: 'flex-start', 
  alignItems: 'center',
  overflow: 'auto',
  '&::-webkit-scrollbar': {
    // Chrome and Safari
    display: 'none',
  },
  scrollbarWidth: 'none', // Firefox
  '-ms-overflow-style': 'none',
  '-webkit-overflow-scrolling': 'touch',
  gap: `${theme.sizing.smPadding}px`,
}));

export const AllExplanationCardsContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  display: 'flex', 
  flexDirection: 'column',
  justifyContent: 'flex-start', 
  alignItems: 'center',
  gap: `${theme.sizing.smPadding}px`,
  overflow: 'auto',
  '&::-webkit-scrollbar': {
    // Chrome and Safari
    display: 'none',
  },
  scrollbarWidth: 'none', // Firefox
  '-ms-overflow-style': 'none',
  '-webkit-overflow-scrolling': 'touch'
}));

export const EmptyExplanationCardContainer = styled(AllExplanationCardsContainer)(({ theme }) => ({
  alignItems: 'center',
  justifyContent: 'center', 
  position: 'relative',
  height: '100%',
  backgroundColor: `rgba(249, 245, 242, 0.5)`,
  gap: '12px',
  padding: `${theme.sizing.mdPadding}px`,
  borderRadius: `${theme.sizing.xSmPadding}px`,
  boxSizing: 'border-box',
  overflow: 'hidden',
}));

export const SingleExplanationCardContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  paddingTop: '20px',
  paddingBottom: '20px',
  paddingLeft: '16px',
  paddingRight: '16px',
  backgroundColor: `rgba(249, 245, 242, 1)`,
  borderRadius: `${theme.sizing.xSmPadding}px`,
  boxSizing: 'border-box',
}));

interface FooterContainerProps {
  screenSize: ScreenSize;
}

export const FooterContainer = styled(Box)<FooterContainerProps>(({ theme, screenSize }) => ({
  display: 'flex', 
  flexDirection: screenSize === ScreenSize.SMALL ? 'column' : 'row',
  paddingTop: '20px',
  gap: '20px',
  position: 'sticky',
  bottom: '30px', 
  paddingLeft: `${theme.sizing.xLgPadding}px`,
  paddingRight: `${theme.sizing.xLgPadding}px`,
}));