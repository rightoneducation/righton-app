import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Typography, Grid, Stack, Box } from '@mui/material';
import {
  GameSessionState,
  ModelHelper,
  ITeam,
  IQuestion,
  IChoice,
} from '@righton/networking';
import { Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { v4 as uuidv4 } from 'uuid';
import { useTranslation } from 'react-i18next';
import { AnswerState } from '../../lib/PlayModels';
import QuestionCard from '../../components/QuestionCard';
import DiscussAnswerCard from '../../components/DiscussAnswerCard';
import ScrollBoxStyled from '../../lib/styledcomponents/layout/ScrollBoxStyled';
import 'swiper/css';
import 'swiper/css/pagination';
import {
  BodyContentAreaDoubleColumnStyled,
  BodyContentAreaSingleColumnStyled,
} from '../../lib/styledcomponents/layout/BodyContentAreasStyled';

interface DiscussAnswerProps {
  isSmallDevice: boolean;
  questionText: string[];
  questionUrl: string;
  answerChoices: IChoice[] | undefined;
  instructions: string[];
  currentState: GameSessionState;
  currentTeam: ITeam;
  currentQuestion: IQuestion;
  isShortAnswerEnabled: boolean;
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
  isShortAnswerEnabled,
}: DiscussAnswerProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const correctAnswer = answerChoices?.find((answer) => answer.isAnswer);
  const correctIndex = answerChoices?.findIndex((answer) => answer.isAnswer);
  const selectedAnswer = ModelHelper.getSelectedAnswer(
    currentTeam!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
    currentQuestion,
    currentState
  );
  const isPlayerCorrect = isShortAnswerEnabled
    ? ModelHelper.isShortAnswerResponseCorrect(
        currentQuestion.responses ?? [],
        currentTeam
      )
    : correctAnswer?.text === selectedAnswer?.text;
    console.log(selectedAnswer?.text);
  const P1LeftColumnContents = (
    <ScrollBoxStyled>
      <Stack spacing={2}>
        <QuestionCard questionText={questionText} imageUrl={questionUrl} />
        <DiscussAnswerCard
          isPlayerCorrect={isPlayerCorrect}
          instructions={instructions}
          answerStatus={
            isPlayerCorrect
              ? AnswerState.PLAYER_SELECTED_CORRECT
              : AnswerState.CORRECT
          }
          answerText={correctAnswer?.text ?? ''}
          answerIndex={correctIndex ?? 0}
          currentState={currentState}
        />
      </Stack>
      {isSmallDevice && currentState === GameSessionState.PHASE_2_DISCUSS && (
        <Typography
          variant="body1"
          sx={{
            textAlign: 'center',
            marginTop: `${theme.sizing.largePadding}px`,
            opacity: 0.5,
          }}
        >
          {t('gameinprogress.general.swipealert')}
        </Typography>
      )}
    </ScrollBoxStyled>
);
  const questionLeftColumnContents = (
      <ScrollBoxStyled>
        <Stack spacing={2}>
          <QuestionCard questionText={questionText} imageUrl={questionUrl} />
          {/* <DiscussAnswerCard
            isPlayerCorrect={isPlayerCorrect}
            instructions={instructions}
            answerStatus={
              isPlayerCorrect
                ? AnswerState.PLAYER_SELECTED_CORRECT
                : AnswerState.CORRECT
            }
            answerText={correctAnswer?.text ?? ''}
            answerIndex={correctIndex ?? 0}
            currentState={currentState}
          /> */}
          {answerChoices?.map(
            (answer, index) =>
              !answer.isAnswer && (
                <DiscussAnswerCard
                  isPlayerCorrect={isPlayerCorrect}
                  instructions={instructions ?? ''}
                  answerStatus={
                    answer.text === selectedAnswer?.text
                      ? AnswerState.SELECTED
                      : AnswerState.DEFAULT
                  }
                  answerText={answer.text}
                  answerIndex={index}
                  answerReason={answer.reason ?? ''}
                  currentState={currentState}
                  key={uuidv4()}
                />
              )
          )}
        </Stack>
        {isSmallDevice && currentState === GameSessionState.PHASE_2_DISCUSS && (
          <Typography
            variant="body1"
            sx={{
              textAlign: 'center',
              marginTop: `${theme.sizing.largePadding}px`,
              opacity: 0.5,
            }}
          >
            {t('gameinprogress.general.swipealert')}
          </Typography>
        )}
      </ScrollBoxStyled>
  );

  const questionRightColumnContents = (
      <ScrollBoxStyled>
        <DiscussAnswerCard
            isPlayerCorrect={isPlayerCorrect}
            instructions={instructions}
            answerStatus={
              isPlayerCorrect
                ? AnswerState.PLAYER_SELECTED_CORRECT
                : AnswerState.CORRECT
            }
            answerText={correctAnswer?.text ?? ''}
            answerIndex={correctIndex ?? 0}
            currentState={currentState}
          />
        {/* <Stack spacing={2}>
          {answerChoices?.map(
            (answer, index) =>
              !answer.isAnswer && (
                <DiscussAnswerCard
                  isPlayerCorrect={isPlayerCorrect}
                  instructions={instructions ?? ''}
                  answerStatus={
                    answer.text === selectedAnswer?.text
                      ? AnswerState.SELECTED
                      : AnswerState.DEFAULT
                  }
                  answerText={answer.text}
                  answerIndex={index}
                  answerReason={answer.reason ?? ''}
                  currentState={currentState}
                  key={uuidv4()}
                />
              )
          )}
        </Stack> */}
      </ScrollBoxStyled>
  );

  return currentState === GameSessionState.PHASE_2_DISCUSS ? (
    <BodyContentAreaDoubleColumnStyled
      container
      spacing={isSmallDevice ? 0 : 2}
    >
      <Grid item xs={12} sm={6} sx={{ width: '100%', height: '100%' }}>
        {isSmallDevice ? (
          <Swiper
            modules={[Pagination]}
            spaceBetween={4}
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
                width: `calc(100% - ${theme.sizing.largePadding * 2}px`,
                height: '100%',
              }}
            >
              {questionLeftColumnContents}
            </SwiperSlide>
            <SwiperSlide
              style={{
                width: `calc(100% - ${theme.sizing.largePadding * 2}px`,
                height: '100%',
              }}
            >
              {questionRightColumnContents}
            </SwiperSlide>
          </Swiper>
        ) : (
          questionLeftColumnContents
        )}
      </Grid>
      <Grid item xs={0} sm={6} sx={{ width: '100%', height: '100%' }}>
        {questionRightColumnContents}
      </Grid>
    </BodyContentAreaDoubleColumnStyled>
  ) : (
    <BodyContentAreaSingleColumnStyled>
      <Box sx={{ width: '100%', height: '100%' }}>
        {P1LeftColumnContents}
      </Box>
    </BodyContentAreaSingleColumnStyled>
  );
}
