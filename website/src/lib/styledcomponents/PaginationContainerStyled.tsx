import { styled } from '@mui/material';
// container for the Swiperjs pagination bullets

// colors

const paginationColor = '#494949';

export default styled('div')(({ theme }) => ({
  height: `${theme.sizing.mdPadding}px`,
  paddingBottom: `${theme.sizing.mdPadding}px`,
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  '--swiper-pagination-color': `${theme.palette.primary.darkGrey}`,
  '--swiper-pagination-bullet-inactive-color': paginationColor,
  '--swiper-pagination-bullet-inactive-opacity': '1',
  '--swiper-pagination-bullet-size': '10px',
  '--swiper-pagination-bullet-horizontal-gap': '5px',
  /* size and shape of bullets handled in <swiper pagination: { renderBullets } /> */
  zIndex: 1,
}));
