import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Typography, Grid, Stack, Box } from '@mui/material';
import {
  GameSessionState,
  ModelHelper,
  ITeam,
  IQuestion,
  IChoice,
  IGameSession,
} from '@righton/networking';
import { Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { v4 as uuidv4 } from 'uuid';
import { useTranslation } from 'react-i18next';
import { AnswerState } from '../../lib/PlayModels';
import QuestionCard from '../../components/QuestionCard';
import DiscussAnswerCard from '../../components/DiscussAnswerCard';
import ScrollBoxStyled from '../../lib/styledcomponents/layout/ScrollBoxStyled';
import ThreeColumnScrollBox from '../../lib/styledcomponents/layout/ThreeColumnScrollBox';
import 'swiper/css';
import 'swiper/css/pagination';
import {
  BodyContentAreaTripleColumnStyled,
  BodyContentAreaDoubleColumnStyled,
  BodyContentAreaSingleColumnStyled,
} from '../../lib/styledcomponents/layout/BodyContentAreasStyled';
import ResultsCard from '../../components/ResultsCard';
// import { useTeamScore } from '../../hooks/useTeamScore';

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
  gameSession: IGameSession;
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
  gameSession,
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

  const questionCorrectAnswerContents = (
    <>
      <Typography
        sx={{
          marginTop: `${theme.sizing.smallPadding}px`,
          marginBottom: `${theme.sizing.smallPadding}px`,
          textAlign: 'center',
          fontFamily: 'Karla',
          fontWeight: '800',
          fontSize: '16px',
          lineHeight: '18.7px',
          color: 'white',
        }}
      >
        {t('gameinprogress.discussanswer.questionanswercolumn')}
      </Typography>
      <ThreeColumnScrollBox>
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
          {isSmallDevice && currentState === GameSessionState.PHASE_1_DISCUSS && (
          <Typography
            variant="body1"
            sx={{
              textAlign: 'center',
              marginTop: `${theme.sizing.largePadding}px`,
              opacity: 0.5,
            }}
          >
            <pre
              style={{
                fontFamily: 'inherit', // Ensures the Typography font family is applied
                fontSize: 'inherit', // Ensures the Typography font size is applied
                whiteSpace: 'pre-wrap', // Preserves newlines and wraps text
                wordWrap: 'break-word', // Breaks long words to fit the container
                margin: 0, // Removes default margin of <pre>
              }}
            >
              {'Swipe to the left to see your\nanswer'}
            </pre>
          </Typography>
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
            <pre
              style={{
                fontFamily: 'inherit', // Ensures the Typography font family is applied
                fontSize: 'inherit', // Ensures the Typography font size is applied
                whiteSpace: 'pre-wrap', // Preserves newlines and wraps text
                wordWrap: 'break-word', // Breaks long words to fit the container
                margin: 0, // Removes default margin of <pre>
              }}
            >
              {'Swipe to the left to see\nexplanations and results'}
            </pre>
          </Typography>
        )}
      </ThreeColumnScrollBox>
    </>
  );

  const incorrectAnswerContents = (
    <>
      <Typography
        sx={{
          marginTop: `${theme.sizing.smallPadding}px`,
          marginBottom: `${theme.sizing.smallPadding}px`,
          textAlign: 'center',
          fontFamily: 'Karla',
          fontWeight: '800',
          fontSize: '16px',
          lineHeight: '18.7px',
          color: 'white',
        }}
      >
        {t('gameinprogress.discussanswer.incorrectanswercolumn')}
      </Typography>
      <ThreeColumnScrollBox>
        <Stack spacing={2}>
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
      </ThreeColumnScrollBox>
    </>
  );

  return currentState === GameSessionState.PHASE_2_DISCUSS ? (
    <BodyContentAreaTripleColumnStyled
      container
      spacing={isSmallDevice ? 0 : 2}
    >
      <Grid item xs={12} sm={4} style={{ width: '100%', height: '100%', padding: '0px' }}>
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
              {questionCorrectAnswerContents}
              
            </SwiperSlide>
            <SwiperSlide
              style={{
                width: `calc(100% - ${theme.sizing.largePadding * 2}px`,
                height: '100%',
              }}
            >
              {incorrectAnswerContents}
              
            </SwiperSlide>
            <SwiperSlide
              style={{
                width: `calc(100% - ${theme.sizing.largePadding * 2}px`,
                height: '100%',
              }}
            >
              <Typography
                sx={{
                  marginTop: `${theme.sizing.smallPadding}px`,
                  marginBottom: `${theme.sizing.smallPadding}px`,
                  textAlign: 'center',
                  fontFamily: 'Karla',
                  fontWeight: '800',
                  fontSize: '16px',
                  lineHeight: '18.7px',
                  color: 'white',
                }}
              >
                Your Answer
              </Typography>
              <ThreeColumnScrollBox>
              <ResultsCard
                gameSession={gameSession}
                answers={answerChoices ?? []}
                selectedAnswer={selectedAnswer ?? null}
                currentState={currentState}
                currentQuestionId={currentQuestion.id}
            />
            </ThreeColumnScrollBox>
            </SwiperSlide>
          </Swiper>
        ) : (
          questionCorrectAnswerContents
        )}
      </Grid>
      <Grid item xs={12} sm={4} style={{ width: '100%', height: '100%',padding: '0px' }}>
        {incorrectAnswerContents}
      </Grid>
      <Grid item xs={12} sm={4} style={{ width: '100%', height: '100%', padding: '0px' }}>
        <Typography
          sx={{
            marginTop: `${theme.sizing.smallPadding}px`,
            marginBottom: `${theme.sizing.smallPadding}px`,
            textAlign: 'center',
            fontFamily: 'Karla',
            fontWeight: '800',
            fontSize: '16px',
            lineHeight: '18.7px',
            color: 'white',
          }}
        >
                  Your Answer
                </Typography>
                <ThreeColumnScrollBox>
              <ResultsCard
                gameSession={gameSession}
                answers={answerChoices ?? []}
                selectedAnswer={selectedAnswer ?? null}
                currentState={currentState}
                currentQuestionId={currentQuestion.id}
            />
            </ThreeColumnScrollBox>
                  </Grid>
    </BodyContentAreaTripleColumnStyled>
  ) : (
    <BodyContentAreaDoubleColumnStyled
      container
      spacing={isSmallDevice ? 0 : 2}
    >
      <Grid item xs={12} sm={6} style={{ width: '100%', height: '100%', padding: '0px' }}>
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
              {questionCorrectAnswerContents}
              
            </SwiperSlide>
            <SwiperSlide
              style={{
                width: `calc(100% - ${theme.sizing.largePadding * 2}px`,
                height: '100%',
              }}
            >
              <Typography
                sx={{
                  marginTop: `${theme.sizing.smallPadding}px`,
                  marginBottom: `${theme.sizing.smallPadding}px`,
                  textAlign: 'center',
                  fontFamily: 'Karla',
                  fontWeight: '800',
                  fontSize: '16px',
                  lineHeight: '18.7px',
                  color: 'white',
                }}
              >
                  Answer
                </Typography>
                <ThreeColumnScrollBox>
              <ResultsCard
                gameSession={gameSession}
                answers={answerChoices ?? []}
                selectedAnswer={selectedAnswer ?? null}
                currentState={currentState}
                currentQuestionId={currentQuestion.id}
            />
            </ThreeColumnScrollBox>
            </SwiperSlide>
          </Swiper>
        ) : (
          questionCorrectAnswerContents
        )}
      </Grid>
      <Grid item xs={0} sm={6} style={{ width: '100%', height: '100%', padding: '0px' }}>
        <Typography
          sx={{
            marginTop: `${theme.sizing.smallPadding}px`,
            marginBottom: `${theme.sizing.smallPadding}px`,
            textAlign: 'center',
            fontFamily: 'Karla',
            fontWeight: '800',
            fontSize: '16px',
            lineHeight: '18.7px',
            color: 'white',
          }}
        >
        Answer
      </Typography>
      <ThreeColumnScrollBox>
              <ResultsCard
                gameSession={gameSession}
                answers={answerChoices ?? []}
                selectedAnswer={selectedAnswer ?? null}
                currentState={currentState}
                currentQuestionId={currentQuestion.id}
            />
            </ThreeColumnScrollBox>
      </Grid>
    </BodyContentAreaDoubleColumnStyled>
  );
  // (
  //   <BodyContentAreaSingleColumnStyled>
  //     <Box sx={{ width: '100%', height: '100%' }}>
  //       {questionCorrectAnswerContents}
        
  //     </Box>
  //   </BodyContentAreaSingleColumnStyled>
  // );
}