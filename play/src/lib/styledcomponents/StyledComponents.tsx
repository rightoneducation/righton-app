import { styled } from '@mui/material/styles';
import { Paper, Stack, Container } from '@mui/material';

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
