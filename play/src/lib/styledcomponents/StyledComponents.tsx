import { styled } from '@mui/material/styles';
import { Paper, Stack, Container, Button, TextField, Box, Grid } from '@mui/material';

// card for question and answer
export const BodyCard = styled(Paper)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  borderRadius: '24px',
  padding: `${theme.sizing.smallPadding}px`,
  backgroundColor: theme.palette.primary.main,
}));

// content container inside of card
export const BodyCardContainer = styled(Stack)({
  width: '100%',
  alignItems: 'center',
});

// container for the Swiperjs pagination bullets
export const PaginationContainer = styled(Container)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '8px',
  '--swiper-pagination-color': `${theme.palette.primary.highlightGradient}`,
  '--swiper-pagination-bullet-inactive-color': `${theme.palette.primary.darkGrey}`,
  '--swiper-pagination-bullet-inactive-opacity': '1',
  '--swiper-pagination-bullet-size': '10px',
  '--swiper-pagination-bullet-horizontal-gap': '4px',
  /* size and shape of bullets handled in <swiper pagination: { renderBullets } /> */
}));

// intro button
export const IntroButton = styled(Button)({
  width: '194.85px', // per figma
  height: '50px',
  borderRadius: '34px',
  textTransform: 'none',
  background: `linear-gradient(90deg, #FC1047 0%, #FC2468 100%)`,
  boxShadow: '0px 5px 22px rgba(253, 34, 100, 0.3)',
  '&:hover': {
    background: `linear-gradient(90deg, #FC1047 0%, #FC2468 100%)`,
  },
});

export const IntroDisabled = styled(IntroButton)({
  opacity: '0.5',
  boxShadow: 'none',
});

// gameplay button
export const GamePlayButton = styled(Button)(({ theme }) => ({
  width: '160px', // per figma
  height: '26px',
  borderRadius: '22px',
  textTransform: 'none',
  background: `${theme.palette.primary.highlightGradient}`,
  boxShadow: '0px 5px 22px rgba(71, 217, 255, 0.3)',
  '&:hover': {
    background: `${theme.palette.primary.highlightGradient}`,
  },
}));

export const GamePlayDisabled = styled(GamePlayButton)(({ theme }) => ({
  background: `${theme.palette.primary.extraDarkGrey}`,
  boxShadow: 'none',
  '&:hover': {
    background: `${theme.palette.primary.extraDarkGrey}`,
  },
}));

export const IntroTextField = styled(TextField)(({ theme }) => ({
  '& .MuiFilledInput-root': {
    borderRadius: 4,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: 'white',
    border: `2px solid ${theme.palette.primary.darkGrey}`,
    width: 'auto',
    transition: theme.transitions.create([
      'border-color',
      'background-color',
      'box-shadow',
    ]),
    '&:hover': {
      backgroundColor: 'white',
    },
    '&.Mui-focused': {
      border: `2px solid ${theme.palette.primary.darkGrey}`,
      outline: `2px solid ${theme.palette.primary.extraDarkGrey}`,
      outlineOffset: '1px',
      backgroundColor: 'white',
    },
  },
}));

export const JoinGameBackgroundContainer = styled(Stack)(({ theme }) => ({
  height: '100svh',
  position: 'fixed', // 100%, fixed to prevent sizing changes on mobile based on url bar etc
  width: '100%',
  background: `${theme.palette.primary.radialGradient} no-repeat`,
  backgroundSize: `100%`,
  backgroundPosition: 'center top',
  backgroundAttachment: 'fixed',
  display: 'flex',
  alignItems: 'center',
}));

// icons for the avatar select screen
interface AvatarIconProps {
  isSelected: boolean;
}

export const AvatarIcon = styled('img', {
  shouldForwardProp: (prop) => prop !== 'isSelected',
})<AvatarIconProps>(({ isSelected }) => ({
  height: '106px',
  width: 'auto',
  boxShadow: '0px 8px 20px rgba(26, 100, 136, 0.3)',
  borderRadius: '20px',
  borderColor: 'white',
  borderStyle: 'solid',
  borderWidth: isSelected ? '6px' : '0px',
  animation: isSelected ? `scaleAnimation 300ms` : 'none',
  '@keyframes scaleAnimation': {
    '0%': {
      opacity: 0,
      transform: 'scale(1)',
    },
    '50%': {
      opacity: 1,
      transform: 'scale(0.95)',
    },
    '100%': {
      opacity: 1,
      transform: 'scale(1.0)',
    },
  },
})
);

// Gameplay layout components (header, footer, background layers)
// top level  container
export const StackContainer = styled(Stack)({
  height: '100%',
  position: 'fixed', // 100%, fixed to prevent sizing changes on mobile based on url bar etc
  width: '100%',
});

// header container
export const HeaderStackItem = styled(Stack)(({ theme }) => ({
  paddingTop: `${theme.sizing.mediumPadding}px`,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  boxShadow: '0px 2px 4px rgba(0, 141, 239, 0.3)',
  background: theme.palette.primary.backgroundGradient,
  border: 'none',
  width: '100vw',
  height: `${theme.sizing.headerHeight}px`,
}));

// body container
export const BodyStackItem = styled(Stack)({
  position: 'relative',
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  alignItems: 'center',
  width: '100vw',
  border: 'none',
});

// upper background area in body
export const BodyBoxUpper = styled(Box)(({ theme }) => ({
  height: '120px',
  width: '100vw',
  background: theme.palette.primary.backgroundGradient,
  boxShadow: '0px 10px 10px rgba(0, 141, 239, 0.25)',
  zIndex: 1,
}));

// lower background area in body
export const BodyBoxLower = styled(Box)(({ theme }) => ({
  flex: 1,
  width: '100vw',
  backgroundColor: theme.palette.primary.main,
  zIndex: 0,
}));

// content area of body that floats above background layers above - Choosing Answer Page
export const BodyContentArea = styled(Grid)({
  position: 'absolute',
  top: '0',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'center',
  maxWidth: '824px',
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  zIndex: 2,
});

// content area of body that floats above background layers above - Phase Results Page
export const BodyContentAreaPhaseResults = styled(BodyContentArea)(({ theme }) => ({
  position: 'fixed',
  justifyContent: 'center',
  maxWidth: '400px',
  paddingLeft: `${theme.sizing.mediumPadding}px`,
  paddingRight: `${theme.sizing.mediumPadding}px`,
}));

// footer container
export const FooterStackItem = styled(Stack)(({ theme }) => ({
  paddingBottom: `${theme.sizing.smallPadding}px`,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.primary.main,
  width: '100vw',
  border: 'none',
  position: 'sticky',
  bottom: 0,
  zIndex: 3,
}));