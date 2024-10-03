import React, { useEffect, useRef, useState } from 'react';
import { Box, Grow, Fade, Skeleton } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { APIClients, IGameTemplate } from '@righton/networking';
import { Swiper, SwiperSlide, SwiperRef } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { v4 as uuidv4 } from 'uuid';
import StyledGameCard from './GameCard';
import placeHolder from '../images/placeHolder.svg';
import SkeletonGameCard from './SkeletonGameCard';
import 'swiper/css';
import 'swiper/css/pagination';

interface GameCardCarouselProps {
    apiClients: APIClients;
    recommendedGames: IGameTemplate[];
}

export default function GameCardCarousel({ apiClients, recommendedGames }: GameCardCarouselProps) {
    const theme = useTheme();
    const swiperRef = useRef<SwiperRef>(null);
    const maxSlides = 12;
    return (
        <Swiper
            style={{ width: '100%' }}
            modules={[Pagination]}
            pagination={{
                el: '.swiper-pagination-container',
                bulletClass: 'swiper-pagination-bullet',
                bulletActiveClass: 'swiper-pagination-bullet-active',
                clickable: true,
                renderBullet(index: number, className: string) {
                    return `<span class="${className}" style="width:20px; height:6px; border-radius:2px"></span>`;
                },
            }}
            ref={swiperRef}
            spaceBetween={theme.sizing.smPadding}
            centeredSlides
            
            navigation
            breakpoints={{
                '375': {
                    slidesPerView: 1.2,
                },
                '744': {
                    slidesPerView: 1.8,
                },
                '1500': {
                    slidesPerView: 3.3,
                },
            }}
        >
            {Array.from({ length: maxSlides }).map((_, index) => {
                const game = recommendedGames[index];
                return (
                    <SwiperSlide key={index}> {/* eslint-disable-line */}
                        {game ? (
                            <StyledGameCard
                                game={game}
                                id={game.id}
                                title={game.title}
                                description={game.description}
                                image={game.imageUrl || placeHolder}
                                apiClients={apiClients}
                            />
                        ) : (
                            <SkeletonGameCard index={index} />
                        )}
                    </SwiperSlide>
                );
            })} 
        </Swiper>
    );
}
