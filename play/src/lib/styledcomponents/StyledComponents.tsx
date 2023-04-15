import { alpha, styled } from '@mui/material/styles';
import { Paper, Stack, Container, Button, TextField } from '@mui/material';

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
  backgroundColor: theme.palette.primary.main,
  padding: '8px',
  '--swiper-pagination-color': `${theme.palette.primary.highlightGradient}`,
  '--swiper-pagination-bullet-inactive-color': `${theme.palette.primary.darkGrey}`,
  '--swiper-pagination-bullet-inactive-opacity': '1',
  '--swiper-pagination-bullet-size': '10px',
  '--swiper-pagination-bullet-horizontal-gap': '4px',
  /* size and shape of bullets handled in <swiper pagination: { renderBullets } /> */
}));

// intro button
export const IntroButton = styled(Button)(({ theme }) => ({
  width: '194.85px', // per figma
  height: '50px',
  borderRadius: '34px',
  textTransform: 'none',
  background: `linear-gradient(90deg, #FC1047 0%, #FC2468 100%)`,
  boxShadow: '0px 5px 22px rgba(253, 34, 100, 0.3)',
  '&:hover': {
    background: `linear-gradient(90deg, #FC1047 0%, #FC2468 100%)`,
  },
}));

export const IntroDisabled = styled(IntroButton)(({ theme }) => ({
  opacity: '0.5',
  boxShadow: 'none',
}));

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
