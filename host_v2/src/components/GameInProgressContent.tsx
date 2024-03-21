import React from 'react';
import { Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { Player, ConfidenceOption, ShortAnswerResponse, Mistake, featuredMistakesSelectionValue } from '../lib/HostModels';
import {
  BodyContentAreaDoubleColumnStyled,
  BodyContentAreaTripleColumnStyled,
  BodyContentAreaSingleColumnStyled,
} from '../lib/styledcomponents/layout/BodyContentAreasStyled';
import Card from './Card';
import ConfidenceCard from './ConfidenceCard';
import ScrollBoxStyled from '../lib/styledcomponents/layout/ScrollBoxStyled';
import PaginationContainerStyled from '../lib/styledcomponents/PaginationContainerStyled';
import 'swiper/css';
import 'swiper/css/pagination';
import FeaturedMistakes from './FeaturedMistakes';
// may have to reformat/restructure this later but here is a sample answer object
interface AnswerOption { 
  instructions: string[] | null; // instructions to get the correct answer if this option is the correct option and null otherwise
  reason: string | null; // reason why answer option is incorrect if this option is incorrect and null otherwise
  content: string; // the answer option itself
} // eslint-disable-line

interface QuestionData {
  text: string; // question text (i.e. the question itself)
  imageUrl: string | undefined; // the url of the image on the question card (if there is one)
} // eslint-disable-line


interface GameInProgressContentProps {
  // props for Confidence Card (see Team, Answer, Player, and ConfidenceOption interfaces above)
  confidenceData: ConfidenceOption[];
  confidenceGraphClickIndex: number | null;
  handleConfidenceGraphClick: (selectedIndex: number | null) => void;
  onSelectMistake: (answer: string, isSelected: boolean) => void;
  sortedMistakes: Mistake[];
  setSortedMistakes: (value: Mistake[]) => void;
  isPopularMode: boolean;
  setIsPopularMode: (value: boolean) => void;

} // eslint-disable-line
export default function GameInProgressContent({
  confidenceData,
  confidenceGraphClickIndex,
  handleConfidenceGraphClick,
  onSelectMistake,
  sortedMistakes,
  setSortedMistakes,
  isPopularMode,
  setIsPopularMode 
}: GameInProgressContentProps) {
  // eslint-disable-line

  const theme = useTheme();
  const isMediumScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));

  const largeScreen = (
    <BodyContentAreaTripleColumnStyled container>
      <Grid item xs={12} sm={4} sx={{ width: '100%', height: '100%' }}>
        <ScrollBoxStyled>
          <ConfidenceCard
            confidenceData={confidenceData}
            graphClickIndex={confidenceGraphClickIndex}
            handleGraphClick={handleConfidenceGraphClick}
          />
          <Card />
        </ScrollBoxStyled>
      </Grid>
      <Grid item xs={12} sm={4} sx={{ width: '100%', height: '100%' }}>
        <ScrollBoxStyled>
          <FeaturedMistakes 
            onSelectMistake={onSelectMistake}
            sortedMistakes={sortedMistakes}
            setSortedMistakes={setSortedMistakes}
            isPopularMode={isPopularMode}
            setIsPopularMode={setIsPopularMode}
            featuredMistakesSelectionValue={featuredMistakesSelectionValue}
          />
          <Card />
        </ScrollBoxStyled>
      </Grid>
      <Grid item xs={12} sm={4} sx={{ width: '100%', height: '100%' }}>
        <ScrollBoxStyled>
          <Card />
          <Card />
        </ScrollBoxStyled>
      </Grid>
    </BodyContentAreaTripleColumnStyled>
  );

  const mediumScreen = (
    <BodyContentAreaDoubleColumnStyled>
      <Swiper
        modules={[Pagination]}
        pagination={{
          el: '.swiper-pagination-container',
          bulletClass: 'swiper-pagination-bullet',
          bulletActiveClass: 'swiper-pagination-bullet-active',
          clickable: true,
          renderBullet(index: number, className: string) {
            return `<span class="${className}" style="width:20px; height:6px; border-radius:0"></span>`;
          },
        }}
        slidesPerView={2.1}
      >
        <SwiperSlide>
          <Grid item xs={12} sm={6} direction="column">
            <ScrollBoxStyled>
              <ConfidenceCard
                confidenceData={confidenceData}
                graphClickIndex={confidenceGraphClickIndex}
                handleGraphClick={handleConfidenceGraphClick}
              />
              <Card />
            </ScrollBoxStyled>
          </Grid>
        </SwiperSlide>
        <SwiperSlide>
          <Grid item xs={12} sm={6} direction="column">
            <ScrollBoxStyled>
              <FeaturedMistakes 
                onSelectMistake={onSelectMistake}
                sortedMistakes={sortedMistakes}
                setSortedMistakes={setSortedMistakes}
                isPopularMode={isPopularMode}
                setIsPopularMode={setIsPopularMode}
                featuredMistakesSelectionValue={featuredMistakesSelectionValue}
              />
              <Card />
            </ScrollBoxStyled>
          </Grid>
        </SwiperSlide>
        <SwiperSlide>
          <Grid item xs={12} sm={6} direction="column">
            <ScrollBoxStyled>
              <Card />
              <Card />
            </ScrollBoxStyled>
          </Grid>
        </SwiperSlide>
      </Swiper>
    </BodyContentAreaDoubleColumnStyled>
  );

  const smallScreen = (
    <BodyContentAreaSingleColumnStyled>
      <Swiper
        modules={[Pagination]}
        pagination={{
          el: '.swiper-pagination-container',
          bulletClass: 'swiper-pagination-bullet',
          bulletActiveClass: 'swiper-pagination-bullet-active',
          clickable: true,
          renderBullet(index: number, className: string) {
            return `<span class="${className}" style="width:20px; height:6px; border-radius:0;"></span>`;
          },
        }}
        slidesPerView={1.1}
      >
        <SwiperSlide>
          <Grid item xs={12} sm={6} sx={{ width: '100%', height: '100%' }}>
            <ScrollBoxStyled>
              <ConfidenceCard
                confidenceData={confidenceData}
                graphClickIndex={confidenceGraphClickIndex}
                handleGraphClick={handleConfidenceGraphClick}
              />
              <Card />
            </ScrollBoxStyled>
          </Grid>
        </SwiperSlide>
        <SwiperSlide>
          <Grid item xs={12} sm={6} sx={{ width: '100%', height: '100%' }}>
            <ScrollBoxStyled>
               <FeaturedMistakes 
                onSelectMistake={onSelectMistake}
                sortedMistakes={sortedMistakes}
                setSortedMistakes={setSortedMistakes}
                isPopularMode={isPopularMode}
                setIsPopularMode={setIsPopularMode}
                featuredMistakesSelectionValue={featuredMistakesSelectionValue}
               />
            </ScrollBoxStyled>
          </Grid>
        </SwiperSlide>
        <SwiperSlide>
          <Grid item xs={12} sm={6} sx={{ width: '100%', height: '100%' }}>
            <ScrollBoxStyled>
              <Card />
              <Card />
            </ScrollBoxStyled>
          </Grid>
        </SwiperSlide>
      </Swiper>
    </BodyContentAreaSingleColumnStyled>
  );

  if (isLargeScreen) {
    return largeScreen;
  }
  if (isMediumScreen) {
    return (
      <>
        {mediumScreen}
        <PaginationContainerStyled
          className="swiper-pagination-container"
          style={{ paddingTop: `${theme.sizing.largePadding}px`, zIndex: 2 }}
        />
      </>
    );
  }
  return (
    <>
      {smallScreen}
      <PaginationContainerStyled
        className="swiper-pagination-container"
        style={{ paddingTop: `${theme.sizing.largePadding}px`, zIndex: 2 }}
      />
    </>
  );
}
