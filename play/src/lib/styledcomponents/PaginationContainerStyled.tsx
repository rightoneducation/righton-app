import { styled } from '@mui/material/styles';
import { Container } from '@mui/material';

// container for the Swiperjs pagination bullets
export default styled(Container)(({ theme }) => ({
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