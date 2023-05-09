import React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Box, Typography, Grid, Stack } from '@mui/material';
import {
  GameSessionState,
  ModelHelper,
  ITeam,
  IQuestion,
} from '@righton/networking';
import { Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { v4 as uuidv4 } from 'uuid';
import { AnswerState } from '../../lib/PlayModels';
import QuestionCard from '../QuestionCard';
import DiscussAnswerCard from '../DiscussAnswerCard';
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

interface DiscussAnswerProps {
  isSmallDevice: boolean;
  questionText: string[];
  questionUrl: string;
  answerChoices: { text: string; isCorrectAnswer: boolean; reason: string; }[] | undefined;
  instructions: string[];
  currentState: GameSessionState;
  currentTeam: ITeam;
  currentQuestion: IQuestion;
}

export default function DiscussAnswer({ 
    isSmallDevice, 
    questionText,
    questionUrl,
    answerChoices,
    instructions,
    currentState,
    currentTeam,
    currentQuestion,
} : DiscussAnswerProps ){
  const theme = useTheme();
  const correctAnswer = answerChoices?.find((answer) => answer.isCorrectAnswer);
  const correctIndex = answerChoices?.findIndex((answer) => answer.isCorrectAnswer);
  const phaseNo = currentState === GameSessionState.PHASE_1_DISCUSS ? 1 : 2;
  const selectedAnswer = ModelHelper.getSelectedAnswer(currentTeam!, currentQuestion, phaseNo);
  const isPlayerCorrect = (correctAnswer?.text === selectedAnswer?.text);
  const questionCorrectAnswerContents = (
    <>
      <Typography
        variant="h2"
        sx={{
          marginTop: `${theme.sizing.smallPadding}px`,
          marginBottom: `${theme.sizing.smallPadding}px`,
          textAlign: 'center',
        }}
      >
        Question and Correct Answer
      </Typography>
      <ScrollBox>
        <Stack spacing = {1}>
          <QuestionCard
            questionText={questionText}
            imageUrl={questionUrl}
          />
          <DiscussAnswerCard
            isPlayerCorrect={isPlayerCorrect}
            instructions={instructions}
            answerStatus={isPlayerCorrect ? AnswerState.PLAYER_SELECTED_CORRECT : AnswerState.CORRECT}
            answerText={correctAnswer?.text ?? ''}
            answerIndex={correctIndex ?? 0}
            currentState={currentState}
          />
        </Stack>
        {isSmallDevice && (
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
        )}
      </ScrollBox>
    </>
  );

  const incorrectAnswerContents = (
    <>
       <Typography
        variant="h2"
        sx={{
          marginTop: `${theme.sizing.smallPadding}px`,
          marginBottom: `${theme.sizing.smallPadding}px`,
          textAlign: 'center',
        }}
      >
        Incorrect Answers
      </Typography>
      <ScrollBox>
        <Stack spacing = {1}>
          { answerChoices?.map((answer, index) => (
            (!answer.isCorrectAnswer && (
                <DiscussAnswerCard
                  isPlayerCorrect={isPlayerCorrect}
                  instructions={instructions}
                  answerStatus={
                    (answer.text === selectedAnswer?.text) ? 
                      AnswerState.SELECTED
                      :
                      AnswerState.DEFAULT
                  }
                  answerText={answer.text}
                  answerIndex={index}
                  answerReason={answer.reason}
                  currentState={currentState}
                  key={uuidv4()}
                />
            ))
          ))}
        </Stack>
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
            {questionCorrectAnswerContents}
          </SwiperSlide>
          <SwiperSlide
            style={{
              width: `calc(100% - ${
                theme.sizing.extraLargePadding * 2
              }px`,
              height: '100%',
            }}
          >
            {incorrectAnswerContents}
          </SwiperSlide>
        </Swiper>
      ) : (
        questionCorrectAnswerContents
      )}
      </Grid>
      <Grid item xs={0} sm={6} sx={{ width: '100%', height: '100%' }}>
      {incorrectAnswerContents}
      </Grid>
    </>
  );
}