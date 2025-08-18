import { styled } from '@mui/material';
// container for the Swiperjs pagination bullets

export default styled('div')(({ theme }) => ({
  height: `${theme.sizing.mdPadding}px`,
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  '--swiper-pagination-color': `#FFF`,
  '--swiper-pagination-bullet-inactive-color': '#afafaf',
  '--swiper-pagination-bullet-inactive-opacity': '1',
  '--swiper-pagination-bullet-size': '10px',
  '--swiper-pagination-bullet-horizontal-gap': '5px',
  /* size and shape of bullets handled in <swiper pagination: { renderBullets } /> */
  zIndex: 1,
}));
