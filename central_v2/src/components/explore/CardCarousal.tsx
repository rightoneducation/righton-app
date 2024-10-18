import React, { useRef } from 'react';
import { useTheme } from '@mui/material/styles';
import { Swiper, SwiperSlide, SwiperRef } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { v4 as uuidv4 } from 'uuid';
import { IGameTemplate, IQuestionTemplate, ElementType } from '@righton/networking';
import StyledGameCard from '../cards/GameCard';
import StyledQuestionCard from '../cards/QuestionCard';
import placeHolder from '../../images/placeHolder.svg';
import SkeletonGameCard from '../cards/GameCardSkeleton';
import 'swiper/css';
import 'swiper/css/pagination';

interface CardCarouselProps {
    elementType: ElementType.GAME | ElementType.QUESTION;
    recommendedElements: IGameTemplate[] | IQuestionTemplate[];
}

export default function CardCarousel({ recommendedElements, elementType }: CardCarouselProps) {
    const theme = useTheme();
    const swiperRef = useRef<SwiperRef>(null);
    const maxSlides = 12;
    return (
        <Swiper
            style={{
                width: '100%',
                height: elementType === ElementType.GAME ? '260px' : '385px',
            }}
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
            updateOnWindowResize
            centeredSlides
            loop
            navigation
            breakpoints={{
                '375': {
                    slidesPerView: 1.2,
                },
                '744': {
                    slidesPerView: 1.8,
                },
                '1024': {
                    slidesPerView: 5.5,

                },
            }}
        >
           {Array.from({ length: maxSlides }).map((_, index) => {
                const element = recommendedElements[index] as IGameTemplate | IQuestionTemplate;
                if (elementType === ElementType.GAME) {
                    const gameElement = element as IGameTemplate;
                    return (
                        <SwiperSlide key={uuidv4()}>
                            {gameElement ? (
                                <StyledGameCard
                                    game={gameElement}
                                    id={gameElement.id}
                                    title={gameElement.title}
                                    description={gameElement.description}
                                    image={gameElement.imageUrl || placeHolder}
                                />
                            ) : (
                                <SkeletonGameCard index={index} />
                            )}
                        </SwiperSlide>
                    );
                }
                const questionElement = element as IQuestionTemplate;
                return (
                    <SwiperSlide key={uuidv4()}>
                        {questionElement ? (
                            <StyledQuestionCard
                                question={questionElement}
                                id={questionElement.id}
                                title={questionElement.title}
                                image={questionElement.imageUrl || placeHolder}
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
