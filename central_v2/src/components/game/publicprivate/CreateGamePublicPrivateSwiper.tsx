import React, {useRef} from 'react';
import { Typography, Box, useTheme, styled } from '@mui/material';
import { Swiper, SwiperSlide, SwiperRef } from 'swiper/react';
import { Pagination } from 'swiper/modules';

const HeaderText = styled(Typography)({
  fontSize: '24px',
  fontFamily: 'Poppins',
  fontWeight: '700',
  lineHeight: '32px',
  color: '#384466',
});

const BodyText = styled(Typography)({
  fontSize: '16px',
  fontFamily: 'Rubik',
  fontWeight: '400',
  lineHeight: '18px',
  color: '#384466',
});

export default function CreateGamePublicPrivateSwiper() {
  const swiperRef = useRef<SwiperRef>(null);
  const theme = useTheme();
  
  return (
    <Swiper
      style={{
        width: '100%',
      }}
      modules={[Pagination]}
      pagination={{
        el: '.swiper-pagination-container',
        bulletClass: 'swiper-pagination-bullet',
        bulletActiveClass: 'swiper-pagination-bullet-active',
        clickable: true,
        renderBullet(index: number, className: string) {
          return `<span class="${className}" style="width:20px; height:6px; border-radius:2px;"></span>`;
        },
      }}
      ref={swiperRef}
      spaceBetween={theme.sizing.smPadding}
      slidesPerView="auto"
      updateOnWindowResize
      navigation
      centeredSlides
      centeredSlidesBounds
    >
      <SwiperSlide>
        <Box
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            gap: `${theme.sizing.mdPadding}px`,
          }}
        >
          <HeaderText>What happens if my game is made public?</HeaderText>
          <BodyText>Public games are usable by other users, once published, without making edits to your game. </BodyText>
          <BodyText>
              <b>If you decide to make your game private before publishing, all public questions added from the question bank will be removed.</b> Once your game is published, you will no longer be able to edit 
              this setting.
          </BodyText>
        </Box>
      </SwiperSlide>
      <SwiperSlide>
        <Box
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            gap: `${theme.sizing.mdPadding}px`,
          }}
        >
          <HeaderText>What happens if my game is made private?</HeaderText>
          <BodyText>Private games are only usable by you, and are not visible to other users.</BodyText>
          <BodyText>
            <b>If you decide to make your game public before publishing, all private questions added from the question bank will be removed. </b> Once your game is published, you will no longer be able to edit 
            this setting.
          </BodyText>
        </Box>
      </SwiperSlide>
    </Swiper>
  )
}