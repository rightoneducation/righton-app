import React from 'react';
import { Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from "swiper/modules";
import {
  BodyContentAreaDoubleColumnStyled,
  BodyContentAreaTripleColumnStyled,
  BodyContentAreaSingleColumnStyled
} from '../lib/styledcomponents/layout/BodyContentAreasStyled';
import Card from './Card';
import QuestionCard from './QuestionCard';
import AnswerCard from './AnswerCard';
import ConfidenceCard from './ConfidenceCard';
import ScrollBoxStyled from '../lib/styledcomponents/layout/ScrollBoxStyled';
import PaginationContainerStyled from '../lib/styledcomponents/PaginationContainerStyled';
import 'swiper/css';
import 'swiper/css/pagination';

// may have to reformat/restructure this later but here is a sample answer object
interface AnswerOption {
  instructions: string[] | null; // instructions to get the correct answer if this option is the correct option and null otherwise
  reason: string | null; // reason why answer option is incorrect if this option is incorrect and null otherwise
  content: string; // the answer option itself
}

interface QuestionData {
  text: string; // question text (i.e. the question itself)
  imageUrl: string | undefined; // the url of the image on the question card (if there is one)
}

interface Player {
  answer: string; // answer chosen by this player
  isCorrect: boolean; // true iff the chosen answer is the correct answer 
  name: string; // this player's name
}

interface ConfidenceOption {
  confidence: string; // the confidence option (i.e. 'NOT_RATED', 'NOT_AT_ALL', 'KINDA', etc.)
  correct: number; // number of teams who selected this option and answered correctly 
  incorrect: number; // number of players who selected tgis option and answered incorrectly 
  players: Player[]; // an array of the players that selected this option
}

interface PlaceholderContentAreaProps {
  // props for Question Card (see QuestionData interface above)
  questionData: QuestionData,
  // props for Answer Card (see AnswerOption interface above)
  answerOptions: AnswerOption[]
  // props for Confidence Card (see Team, Answer, Player, and ConfidenceOption interfaces above)
  confidenceData: ConfidenceOption[],
  confidenceGraphClickIndex: number | null;
  handleConfidenceGraphClick: (selectedIndex: number | null) => void
}// eslint-disable-line
export default function PlaceholderContentArea({
  questionData,
  answerOptions,
  confidenceData, confidenceGraphClickIndex, handleConfidenceGraphClick }: PlaceholderContentAreaProps) {
  // eslint-disable-line

  const theme = useTheme();
  const isMediumScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));

  const largeScreen =
    <BodyContentAreaTripleColumnStyled container>
      <Grid item xs={12} sm={4} sx={{ width: '100%', height: '100%' }}>
        <ScrollBoxStyled>
          <ConfidenceCard confidenceData={confidenceData} graphClickIndex={confidenceGraphClickIndex} handleGraphClick={handleConfidenceGraphClick} />
          <Card />
        </ScrollBoxStyled>
      </Grid>
      <Grid item xs={12} sm={4} sx={{ width: '100%', height: '100%' }}>
        <ScrollBoxStyled>
          <Card />
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

  const mediumScreen =
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
        <SwiperSlide >
          <Grid item xs={12} sm={6} direction="column">
            <ScrollBoxStyled>
              <ConfidenceCard confidenceData={confidenceData} graphClickIndex={confidenceGraphClickIndex} handleGraphClick={handleConfidenceGraphClick} />
              <Card />
            </ScrollBoxStyled>
          </Grid>
        </SwiperSlide>
        <SwiperSlide >
          <Grid item xs={12} sm={6} direction="column">
            <ScrollBoxStyled>
              <Card />
              <Card />
            </ScrollBoxStyled>
          </Grid>
        </SwiperSlide>
        <SwiperSlide >
          <Grid item xs={12} sm={6} direction="column">
            <ScrollBoxStyled>
              <Card />
              <Card />
            </ScrollBoxStyled>
          </Grid>
        </SwiperSlide>
      </Swiper>
    </BodyContentAreaDoubleColumnStyled>

  const smallScreen =
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
              <ConfidenceCard confidenceData={confidenceData} graphClickIndex={confidenceGraphClickIndex} handleGraphClick={handleConfidenceGraphClick} />
              <Card />
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

  if (isLargeScreen) {
    return (
      largeScreen
    );
  } if (isMediumScreen) {
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
