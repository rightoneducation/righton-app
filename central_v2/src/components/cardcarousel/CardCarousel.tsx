import React, { useRef } from 'react';
import { useTheme } from '@mui/material/styles';
import { Swiper, SwiperSlide, SwiperRef } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { v4 as uuidv4 } from 'uuid';
import {
  IGameTemplate,
  IQuestionTemplate,
  ElementType,
} from '@righton/networking';
import StyledGameCard from '../cards/GameCard';
import StyledQuestionCard from '../cards/QuestionCard';
import placeHolder from '../../images/placeHolder.svg';
import SkeletonGameCard from '../cards/GameCardSkeleton';
import SkeletonQuestionCard from '../cards/QuestionCardSkeleton';
import 'swiper/css';
import 'swiper/css/pagination';
import './CardCarousel.css';

interface CardCarouselProps<T> {
  elementType: ElementType.GAME | ElementType.QUESTION;
  recommendedElements: T[];
  setIsTabsOpen: (isOpen: boolean) => void;
  handleView: (element: T, elements: T[]) => void;
}

export default function CardCarousel<
  T extends IGameTemplate | IQuestionTemplate,
>({
  recommendedElements,
  elementType,
  setIsTabsOpen,
  handleView,
}: CardCarouselProps<T>) {
  const theme = useTheme();
  const swiperRef = useRef<SwiperRef>(null);
  const maxSlides = 12;
  const handleViewButtonClick = (element: T) => {
    handleView(element, recommendedElements as T[]);
  };

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
      slidesPerView='auto'
      updateOnWindowResize
      centeredSlides
      loop
      navigation
    >
      {Array.from({ length: maxSlides }).map((_, index) => {
        const element = recommendedElements[index] as
          | IGameTemplate
          | IQuestionTemplate;
        if (elementType === ElementType.GAME) {
          const gameElement = element as IGameTemplate;
          return (
            <SwiperSlide key={uuidv4()} style={{width: '385px'}}>
              {gameElement ? (
                <StyledGameCard
                  game={gameElement}
                  id={gameElement.id}
                  title={gameElement.title}
                  description={gameElement.description}
                  image={gameElement.imageUrl || placeHolder}
                  isCarousel
                  handleViewButtonClick={
                    handleViewButtonClick as (element: IGameTemplate) => void
                  }
                />
              ) : (
                <SkeletonGameCard index={index} />
              )}
            </SwiperSlide>
          );
        }
        const questionElement = element as IQuestionTemplate;
        return (
          <SwiperSlide key={uuidv4()} className="fixed-swiper-slide">
            {questionElement ? (
              <StyledQuestionCard
                question={questionElement}
                id={questionElement.id}
                title={questionElement.title}
                image={questionElement.imageUrl || placeHolder}
                handleViewButtonClick={
                  handleViewButtonClick as (element: IQuestionTemplate) => void
                }
              />
            ) : (
              <SkeletonQuestionCard index={index} />
            )}
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
}
