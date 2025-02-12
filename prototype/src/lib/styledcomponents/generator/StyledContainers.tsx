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
  gap: '20px'
}));

export const HeaderContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  paddingTop: `${theme.sizing.mdPadding}px`,
  display: 'flex', 
  flexDirection: 'column', 
  gap: '20px',
  alignItems: 'center',
  paddingLeft: `${theme.sizing.xLgPadding}px`,
  paddingRight: `${theme.sizing.xLgPadding}px`,
  boxSizing: 'border-box',
}));

export const CardsContainer = styled(Grid)(({ theme }) => ({ 
  maxWidth: '1013px', 
  width: '100%',
  flexGrow: 1,
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

export const VersionContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: `${theme.sizing.smPadding}px`,
  right: `${theme.sizing.smPadding}px`,
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
}));

interface ExplanationCardContainerProps {
  isQuestionFilled: boolean,
}

export const ExplanationCardContainer = styled(Box)<ExplanationCardContainerProps>(({ theme, isQuestionFilled }) => ({
  height: 'fit-content',
  width: '100%',
  display: 'flex', 
  flexDirection: 'column',
  justifyContent: 'flex-start', 
  alignItems: 'center',
  backgroundColor: isQuestionFilled ? `rgba(249, 245, 242, 1)` : `rgba(249, 245, 242, 0.5)`,
  borderRadius: `${theme.sizing.smPadding}px`,
  gap: 20,
  padding: `${theme.sizing.smPadding}px`,
  boxSizing: 'border-box',
  overflow: 'auto',
  '&::-webkit-scrollbar': {
    // Chrome and Safari
    display: 'none',
  },
  scrollbarWidth: 'none', // Firefox
  '-ms-overflow-style': 'none',
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