import { Box, Grid, styled } from '@mui/material';
import MathBackground from '../../../img/MathSymbolsBackground.svg';

export const MainContainer = styled(Box)(({ theme }) => ({
  height: '100vh', 
  width: '100vw', 
  backgroundColor: `#203469`,
  backgroundImage: `
    url(${MathBackground})
  `,
  display: 'flex', 
  flexDirection: 'column',
  justifyContent: 'flex-start', 
  alignItems: 'center',
  paddingTop: `${theme.sizing.mdPadding}px`,
  paddingLeft: `${theme.sizing.xLgPadding}px`,
  paddingRight: `${theme.sizing.xLgPadding}px`,
  boxSizing: 'border-box',
  overflow: 'auto',
  '&::-webkit-scrollbar': {
    // Chrome and Safari
    display: 'none',
  },
  scrollbarWidth: 'none', // Firefox
  '-ms-overflow-style': 'none',
  gap: '40px'
}));

export const HeaderContainer = styled(Box)(({ theme }) => ({
  display: 'flex', 
  flexDirection: 'column', 
  gap: '20px',
  alignItems: 'center',
}));

export const CardsContainer = styled(Grid)(({ theme }) => ({ 
  maxWidth: '1013px', 
  width: '100%',
}));

export const VersionContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: `${theme.sizing.smPadding}px`,
  right: `${theme.sizing.smPadding}px`,
}));

interface ExplanationCardContainerProps {
  isQuestionFilled: boolean,
}

export const ExplanationCardContainer = styled(Box)<ExplanationCardContainerProps>(({ theme, isQuestionFilled }) => ({
  height: '100%', 
  display: 'flex', 
  flexDirection: 'column',
  justifyContent: 'flex-start', 
  alignItems: 'center',
  backgroundColor: isQuestionFilled ? `rgba(249, 245, 242, 1)` : `rgba(249, 245, 242, 0.5)`,
  borderRadius: `${theme.sizing.smPadding}px`,
  padding: '20px',
  boxSizing: 'border-box',
  gap: 20,
}));