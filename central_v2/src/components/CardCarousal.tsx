import React, { useEffect, useRef } from 'react';
import { Box, Grid} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { Swiper, SwiperSlide, SwiperRef} from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import StyledGameCard from './GameCard';
import { ScreenSize } from '../lib/HostModels';
import PaginationContainerStyled from '../lib/PaginationContainerStyled';


function GameCardCarousal()
    {
    const theme = useTheme();
    const swiperRef = useRef<SwiperRef>(null);
    return (
        <Swiper
            style = {{width:'100%'}}
            modules={[Pagination]}
            pagination={{
                el: '.swiper-pagination-container',
                bulletClass: 'swiper-pagination-bullet',
                bulletActiveClass: 'swiper-pagination-bullet-active',
                clickable: true,
                renderBullet(index: number, className: string,) {
                return `<span class="${className}" style="width:20px; height:6px; border-radius:2px" ></span>`;
                },
            }}
            ref={swiperRef}
            spaceBetween={`${theme.sizing.smPadding}px`}
            centeredSlides // center the current slide
            loop
            navigation
            breakpoints={{
                '375': {
                    slidesPerView: 1.186, // Show partial next card on small screens
                },
                '744': {
                    slidesPerView: 1.826, // Show partial next card on medium screens
                },
                '1500': {
                    slidesPerView: 3.31, // Show partial next card on large screens
                },
            }}
        >
            <SwiperSlide >
                <StyledGameCard />
            </SwiperSlide>
            <SwiperSlide >
                <StyledGameCard />
            </SwiperSlide>
            <SwiperSlide >
                <StyledGameCard />
            </SwiperSlide>
            <SwiperSlide >
                <StyledGameCard />
            </SwiperSlide>
            <SwiperSlide >
                <StyledGameCard />
            </SwiperSlide>
            <SwiperSlide >
                <StyledGameCard />
            </SwiperSlide>
            <SwiperSlide >
                <StyledGameCard />
            </SwiperSlide>
        </Swiper>
    )
}

export default GameCardCarousal;
