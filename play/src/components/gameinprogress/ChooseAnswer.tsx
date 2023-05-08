import React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Box, Typography, Grid } from '@mui/material';
import {
  GameSessionState,
} from '@righton/networking';
import { Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import QuestionCard from '../QuestionCard';
import AnswerCard from '../AnswerCard';
import 'swiper/css';
import 'swiper/css/pagination';

const ScrollBox = styled(Box)(({ theme }) => ({
  height: `calc(100% - ${theme.sizing.footerHeight}px - ${theme.sizing.extraSmallPadding}px)`, // footer height & 8px grid spacing
  paddingBottom: `${theme.sizing.extraSmallPadding}px`, // added so box shadow shows around edge of card
  paddingLeft: `${theme.sizing.extraSmallPadding}px`,
  paddingRight: `${theme.sizing.extraSmallPadding}px`,
  overflow: 'auto',
  touchAction: 'pan-y', // this constrains the touch controls to only vertical scrolling so it doesn't mess with the swiper X direction swipe
  '&::-webkit-scrollbar': {
    // Chrome and Safari
    display: 'none',
  },
  scrollbarWidth: 'none', // Firefox
  '-ms-overflow-style': 'none', // IE and Edge
}));

interface ChooseAnswerProps {
  isSmallDevice: boolean;
  questionText: string[];
  questionUrl: string;
  answerChoices: { text: string; isCorrectAnswer: boolean; }[] | undefined;
  isSubmitted: boolean;
  handleSubmitAnswer: () => void;
  currentState: GameSessionState;
  selectedAnswer: number | null;
  handleSelectAnswer: (answer: number) => void;
}

export default function ChooseAnswer({ 
    isSmallDevice, 
    questionText,
    questionUrl,
    answerChoices,
    isSubmitted,
    handleSubmitAnswer,
    currentState,
    selectedAnswer,
    handleSelectAnswer,
} : ChooseAnswerProps ){
  const theme = useTheme();
  const questionContents = (
    <>
      <Typography
        variant="h2"
        sx={{
          marginTop: `${theme.sizing.smallPadding}px`,
          marginBottom: `${theme.sizing.smallPadding}px`,
          textAlign: 'center',
        }}
      >
        Question
      </Typography>
      <ScrollBox>
        <QuestionCard
          questionText={questionText}
          imageUrl={questionUrl}
        />
        {isSmallDevice ? (
          <Typography
            variant="body1"
            sx={{
              textAlign: 'center',
              marginTop: `${theme.sizing.largePadding}px`,
              opacity: 0.5,
            }}
          >
            Scroll to the left to answer the question.
          </Typography>
        ) : null}
      </ScrollBox>
    </>
  );

  const answerContents = (
    <>
      <Typography
        variant="h2"
        sx={{
          marginTop: '16px',
          marginBottom: `${theme.sizing.smallPadding}px`,
          textAlign: 'center',
        }}
      >
        Answer
      </Typography>
      <ScrollBox>
        <AnswerCard
          answers={answerChoices}
          isSubmitted={isSubmitted}
          handleSubmitAnswer={handleSubmitAnswer}
          currentState={currentState}
          selectedAnswer={selectedAnswer}
          handleSelectAnswer={handleSelectAnswer}
        />
      </ScrollBox>
    </>
  );



  return (
    <>
      <Grid item xs={12} sm={6} sx={{ width: '100%', height: '100%' }}>
      {isSmallDevice ? (
        <Swiper
          modules={[Pagination]}
          spaceBetween={24}
          centeredSlides
          slidesPerView="auto"
          pagination={{
            el: '.swiper-pagination-container',
            bulletClass: 'swiper-pagination-bullet',
            bulletActiveClass: 'swiper-pagination-bullet-active',
            clickable: true,
            renderBullet(index, className) {
              return `<span class="${className}" style="width:20px; height:6px; border-radius:0"></span>`;
            },
          }}
          style={{ height: '100%' }}
        >
          <SwiperSlide
            style={{
              width: `calc(100% - ${
                theme.sizing.extraLargePadding * 2
              }px`,
              height: '100%',
            }}
          >
            {questionContents}
          </SwiperSlide>
          <SwiperSlide
            style={{
              width: `calc(100% - ${
                theme.sizing.extraLargePadding * 2
              }px`,
              height: '100%',
            }}
          >
            {answerContents}
          </SwiperSlide>
        </Swiper>
      ) : (
        questionContents
      )}
      </Grid>
      <Grid item xs={0} sm={6} sx={{ width: '100%' }}>
      {answerContents}
      </Grid>
    </>
  );
}