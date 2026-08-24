import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperClass } from 'swiper';
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
import CarouselDots from './CarouselDots';
import { ScreenSize } from '../../lib/CentralModels';
import {
  useCentralDataDispatch,
  useCentralDataState,
} from '../../hooks/context/useCentralDataContext';
import 'swiper/css';
import './CardCarousel.css';

interface CardCarouselProps<T> {
  screenSize: ScreenSize;
  elementType: ElementType.GAME | ElementType.QUESTION;
  recommendedElements: T[];
  setIsTabsOpen: (isOpen: boolean) => void;
  handleView: (element: T, elements: T[]) => void;
  slideCount?: number;
}

export default function CardCarousel<
  T extends IGameTemplate | IQuestionTemplate,
>({
  screenSize,
  recommendedElements,
  elementType,
  setIsTabsOpen,
  handleView,
  slideCount,
}: CardCarouselProps<T>) {
  const theme = useTheme();
  const navigate = useNavigate();
  // skeletons only while the query is in flight; once the games arrive the
  // carousel renders exactly what came back, so an under- or over-returning
  // query cannot strand permanent loading cards or silently drop a game
  const maxSlides =
    recommendedElements.length > 0 ? recommendedElements.length : slideCount ?? 12;
  /**
   * Which card opens dead centre. Derived from slideCount -- a constant known at
   * mount -- and NOT from maxSlides: Swiper reads initialSlide once during init,
   * while the element array is still empty, so anything data-derived resolves
   * against the placeholder and centres the wrong card.
   *
   * Callers that don't declare a curated size (the questions carousel) get 0 and
   * open at the start, as before.
   */
  const initialSlide = slideCount ? Math.floor(slideCount / 2) : 0;

  /**
   * Mirrors the swiper's own snap grid so the dots can be keyed to distinct
   * scroll positions rather than to slides. Re-read on resize because the grid
   * is rebuilt whenever the number of visible cards changes.
   */
  const [swiper, setSwiper] = useState<SwiperClass | null>(null);
  const [snapGrid, setSnapGrid] = useState<number[]>([]);
  const [snapIndex, setSnapIndex] = useState(0);

  const syncSnaps = (instance: SwiperClass) => {
    setSnapGrid([...instance.snapGrid]);
    setSnapIndex(instance.snapIndex);
  };

  // collapse duplicate positions, keeping the first slide that reaches each
  const firstSlideAtPosition = new Map<number, number>();
  snapGrid.forEach((position, index) => {
    if (!firstSlideAtPosition.has(position))
      firstSlideAtPosition.set(position, index);
  });
  const stops = Array.from(firstSlideAtPosition.values());
  const activeStop = Math.max(
    Array.from(firstSlideAtPosition.keys()).indexOf(snapGrid[snapIndex]),
    0,
  );
  const handleViewButtonClick = (element: T) => {
    handleView(element, recommendedElements as T[]);
  };
  const centralData = useCentralDataState();
  const centralDataDispatch = useCentralDataDispatch();
  const favoriteQuestionTemplateIds =
    centralData.userProfile?.favoriteQuestionTemplateIds;
  const favoriteGameTemplateIds =
    centralData.userProfile?.favoriteGameTemplateIds;

  const handleCloneButtonClick = (element: IQuestionTemplate) => {
    centralDataDispatch({
      type: 'SET_SELECTED_QUESTION',
      payload: element,
    });
    navigate(`/clone/question/${element.publicPrivateType}/${element.id}`);
  };
  return (
    <>
    <Swiper
      style={{
        width: '100%',
      }}
      onSwiper={(instance) => {
        setSwiper(instance);
        syncSnaps(instance);
      }}
      onSnapIndexChange={syncSnaps}
      onResize={syncSnaps}
      spaceBetween={theme.sizing.smPadding}
      slidesPerView="auto"
      initialSlide={initialSlide}
      updateOnWindowResize
      centeredSlides
      // clamps the scroll at both ends: without it the first and last cards
      // centre themselves and leave half a viewport of empty space beside them
      centeredSlidesBounds
      // above ~2791px every card fits and the strip would sit left-aligned;
      // this centres the group so the leftover margins are even
      centerInsufficientSlides
    >
      {Array.from({ length: maxSlides }).map((_, index) => {
        const element = recommendedElements[index] as
          IGameTemplate | IQuestionTemplate;
        if (elementType === ElementType.GAME) {
          const gameElement = element as IGameTemplate;
          return (
            <SwiperSlide
              key={gameElement?.id ?? `slide-${index}`}
              style={{
                width: screenSize !== ScreenSize.LARGE ? '290px' : '385px',
              }}
            >
              {gameElement ? (
                <StyledGameCard
                  screenSize={screenSize}
                  game={gameElement}
                  id={gameElement.id}
                  title={gameElement.title}
                  description={gameElement.description}
                  image={gameElement.imageUrl || placeHolder}
                  isFavorite={
                    favoriteGameTemplateIds?.includes(gameElement.id) || false
                  }
                  isCarousel
                  handleViewButtonClick={
                    handleViewButtonClick as (element: IGameTemplate) => void
                  }
                />
              ) : (
                <SkeletonGameCard
                  isCarousel
                  screenSize={screenSize}
                  index={index}
                />
              )}
            </SwiperSlide>
          );
        }
        const questionElement = element as IQuestionTemplate;
        return (
          <SwiperSlide
            key={questionElement?.id ?? `slide-${index}`}
            className="fixed-swiper-slide-question"
          >
            {questionElement ? (
              <StyledQuestionCard
                question={questionElement}
                id={questionElement.id}
                title={questionElement.title}
                image={questionElement.imageUrl || placeHolder}
                isCarousel
                isFavorite={
                  favoriteQuestionTemplateIds?.includes(questionElement.id) ||
                  false
                }
                handleViewButtonClick={
                  handleViewButtonClick as (element: IQuestionTemplate) => void
                }
                handleCloneButtonClick={
                  handleCloneButtonClick as (element: IQuestionTemplate) => void
                }
              />
            ) : (
              <SkeletonQuestionCard index={index} />
            )}
          </SwiperSlide>
        );
      })}
    </Swiper>
    <CarouselDots
      stops={stops}
      activeStop={activeStop}
      onSelect={(slideIndex) => swiper?.slideTo(slideIndex)}
    />
    </>
  );
}
