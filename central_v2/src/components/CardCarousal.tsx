import React, { useEffect, useRef, useState } from 'react';
import { Box, Grow, Fade } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { APIClients, IGameTemplate } from '@righton/networking';
import { Swiper, SwiperSlide, SwiperRef } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { v4 as uuidv4 } from 'uuid';
import StyledGameCard from './GameCard';
import placeHolder from '../images/placeHolder.svg';
import 'swiper/css';
import 'swiper/css/pagination';

interface GameCardCarouselProps {
    apiClients: APIClients;
    recommendedGames: IGameTemplate[];
}

const GameCard = styled(Box)(({ theme }) => ({
    width: '100%',
    height: '260px',
    padding: `12px ${theme.sizing.smPadding}px 12px ${theme.sizing.smPadding}px`,
    gap: `${theme.sizing.smPadding}px`,
    borderRadius: `${theme.sizing.smPadding}px`,
    boxShadow: `0px ${theme.sizing.xSmPadding}px ${theme.sizing.smPadding}px -4px #5C769166`,
    background: 'linear-gradient(90deg, #EFEFEF 0%, #C2BEBE 100%)',
    backgroundSize: '200% 200%',
    animation: 'gradient-animation 3s ease infinite',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
    overflow: 'visible',
  
    '@keyframes gradient-animation': {
      '0%': {
        backgroundPosition: '0% 50%',
      },
      '50%': {
        backgroundPosition: '100% 50%',
      },
      '100%': {
        backgroundPosition: '0% 50%',
      },
    },
  }));
export default function GameCardCarousel({ apiClients, recommendedGames }: GameCardCarouselProps) {
    const theme = useTheme();
    const swiperRef = useRef<SwiperRef>(null);
    const loadingCards = Array(12).fill(0);
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
            { recommendedGames.length > 0 ?
            recommendedGames.map((game, index) => (
                <SwiperSlide key={game.id}>
                    <Fade in timeout={1000}  style={{ transformOrigin: '0 0 0', transitionDelay: `${200*index}ms` }}>     
                        <div>
                        <StyledGameCard
                            id={game.id || 'no id given'}
                            title={game.title || 'Untitled Game'}
                            description={game.description || 'No description available'}
                            image={game.imageUrl || placeHolder}
                            apiClients={apiClients}
                            game={game}
                        />
                        </div>
                    </Fade>
                </SwiperSlide>
            ))
            : 
                loadingCards.map((_, index) => (
                    <SwiperSlide key={uuidv4()}>
                        <Fade in timeout={1000}  style={{ transformOrigin: '0 0 0', transitionDelay: `${200*index}ms` }}>                        
                            <GameCard />                        
                        </Fade>
                    </SwiperSlide>
                ))
        }
        </Swiper>
    );
}
