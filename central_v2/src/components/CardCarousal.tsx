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

interface GameCardCarousalProps {
    screenSize: ScreenSize;
  }

function GameCardCarousal({
    screenSize,
}: GameCardCarousalProps)
 {
const theme = useTheme();
  const swiperRef = useRef<SwiperRef>(null);
  const renderPagination = () => (
    <PaginationContainerStyled className="swiper-pagination-container" />
  );
    switch(screenSize) {
        case (ScreenSize.SMALL):
          console.log("in small");
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
                spaceBetween= '16px'
                centeredSlides // Center the current slide
                loop
                navigation
                breakpoints={{
                    375: {
                        slidesPerView: 1.2, // Show partial next card on small screens
                    },
                    744: {
                        slidesPerView: 2.3, // Show partial next card on medium screens
                    },
                    1500: {
                        slidesPerView: 3.3, // Show partial next card on large screens
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
            </SwiperSlide><SwiperSlide >
                <StyledGameCard />
            </SwiperSlide>
            {/* Add more SwiperSlides as needed */}
        </Swiper>

        );
        case (ScreenSize.MEDIUM):
            console.log("in medium");
            return (
                <Swiper
                spaceBetween={16}
                slidesPerView={1.5} // Show half of the next slide
                centeredSlides // Center the current slide
                breakpoints={{
                    375: {
                        slidesPerView: 1.2, // Show partial next card on small screens
                    },
                    744: {
                        slidesPerView: 2.3, // Show partial next card on medium screens
                    },
                    1500: {
                        slidesPerView: 3.3, // Show partial next card on large screens
                    },
                }}
                loop
                navigation
                pagination={{ clickable: true }}
            >
                <SwiperSlide>
                    <StyledGameCard />
                </SwiperSlide>
                <SwiperSlide>
                    <StyledGameCard />
                </SwiperSlide>
                <SwiperSlide>
                    <StyledGameCard />
                </SwiperSlide>
                <SwiperSlide>
                    <StyledGameCard />
                </SwiperSlide>
                {/* Add more SwiperSlides as needed */}
            </Swiper>
          );
    case (ScreenSize.LARGE):
    default:
        console.log("in large");
      return (
        <Swiper
            spaceBetween={16}
            slidesPerView={1.5} // Show half of the next slide
            centeredSlides // Center the current slide
            breakpoints={{
                375: {
                    slidesPerView: 1.2, // Show partial next card on small screens
                },
                744: {
                    slidesPerView: 2.3, // Show partial next card on medium screens
                },
                1500: {
                    slidesPerView: 3.3, // Show partial next card on large screens
                },
            }}
            loop
            navigation
            pagination={{ clickable: true }}
        >
            <SwiperSlide>
                <StyledGameCard />
            </SwiperSlide>
            <SwiperSlide>
                <StyledGameCard />
            </SwiperSlide>
            <SwiperSlide>
                <StyledGameCard />
            </SwiperSlide>
            <SwiperSlide>
                <StyledGameCard />
            </SwiperSlide>
            {/* Add more SwiperSlides as needed */}
        </Swiper>
        );
    }
}
export default GameCardCarousal;
