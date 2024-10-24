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

interface CardCarouselProps<T> {
  elementType: ElementType.GAME | ElementType.QUESTION;
  recommendedElements: T[];
  setIsTabsOpen: (isOpen: boolean) => void;
  handleView: (element: T, elements: T[]) => void;
}

export default function CardCarouse<
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
  const carouselSlideNumMap = {
    [ElementType.GAME]: {
      [theme.breakpoints.values.sm]: 1.2,
      [theme.breakpoints.values.md]: 1.8,
      [theme.breakpoints.values.lg]: 3.5,
    },
    [ElementType.QUESTION]: {
      [theme.breakpoints.values.sm]: 2.2,
      [theme.breakpoints.values.md]: 3.8,
      [theme.breakpoints.values.lg]: 5.5,
    },
  };

  const handleViewButtonClick = (element: T) => {
    handleView(element, recommendedElements as T[]);
  };

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
        [theme.breakpoints.values.sm]: {
          slidesPerView:
            carouselSlideNumMap[elementType][theme.breakpoints.values.sm],
        },
        [theme.breakpoints.values.md]: {
          slidesPerView:
            carouselSlideNumMap[elementType][theme.breakpoints.values.md],
        },
        [theme.breakpoints.values.lg]: {
          slidesPerView:
            carouselSlideNumMap[elementType][theme.breakpoints.values.lg],
        },
      }}
    >
      {Array.from({ length: maxSlides }).map((_, index) => {
        const element = recommendedElements[index] as
          | IGameTemplate
          | IQuestionTemplate;
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
          <SwiperSlide key={uuidv4()}>
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
