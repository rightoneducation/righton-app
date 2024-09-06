import React, { useEffect, useRef, useState } from 'react';
import { APIClients, IGameTemplate } from '@righton/networking';
import { Swiper, SwiperSlide, SwiperRef } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { useTheme } from '@mui/material/styles';
import StyledGameCard from './GameCard';
import placeHolder from '../images/placeHolder.svg';


interface GameCardCarouselProps {
    apiClients: APIClients;
    recommendedGames: IGameTemplate[];
}

export default function GameCardCarousel({ apiClients, recommendedGames }: GameCardCarouselProps) {
    const theme = useTheme();
    const swiperRef = useRef<SwiperRef>(null);


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
            loop
            navigation
            breakpoints={{
                '375': {
                    slidesPerView: 1.186,
                },
                '744': {
                    slidesPerView: 1.826,
                },
                '1500': {
                    slidesPerView: 3.31,
                },
            }}
        >
            {recommendedGames.map((game) => (
                <SwiperSlide key={game.id}>
                    <StyledGameCard
                        id={game.id || 'no id given'}
                        title={game.title || 'Untitled Game'}
                        description={game.description || 'No description available'}
                        image={game.imageUrl || placeHolder}
                        apiClients={apiClients}
                        game={game}
                    />
                </SwiperSlide>
            ))}
        </Swiper>
    );
}
