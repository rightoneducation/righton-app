import React from 'react';
import { useTheme, styled } from '@mui/material/styles';
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
import AnswerResponsesCard from '../../components/AnswerResponses/AnswerResponsesCard';
import ScrollBoxStyled from '../../lib/styledcomponents/layout/ScrollBoxStyled';
import {
  BodyContentAreaTripleColumnStyled,
  BodyContentAreaTripleColumnStyledNoSwiper,
  BodyContentAreaSingleColumnStyled,
} from '../../lib/styledcomponents/layout/BodyContentAreasStyled';
import 'swiper/css';
import 'swiper/css/pagination';

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
  newPoints: number | undefined;
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
  newPoints,
}: DiscussAnswerProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const phaseOneResponses = currentQuestion?.answerData.phase1.responses.filter((response) => response.multiChoiceCharacter !== '–' || response.isCorrect).reverse();
  let phaseTwoResponses = null;
  let otherResponses = null;
  if (currentState === GameSessionState.PHASE_2_DISCUSS){
    const selectedMistakes = currentQuestion?.answerData.phase1.responses.filter((response) => response.isSelectedMistake).reverse();
    const selectedRawAnswers = new Set(selectedMistakes.map(r => r.rawAnswer));
    if (isShortAnswerEnabled){
    phaseTwoResponses = currentQuestion?.answerData.phase2.responses
      .filter(response2 => selectedRawAnswers.has(response2.rawAnswer)).reverse();
    otherResponses = currentQuestion?.answerData.phase1.responses
      .filter(response2 => !selectedRawAnswers.has(response2.rawAnswer) && response2.count > 0 && !response2.isCorrect).reverse();
    } else {
      phaseTwoResponses = currentQuestion?.answerData.phase2.responses.filter((response) => response.multiChoiceCharacter !== '–' || response.isCorrect).reverse(); 
    }
  }
  const correctResponse = currentQuestion.answerData.phase1.responses.find((response) => response.isCorrect);
  const selectedAnswer = ModelHelper.getSelectedAnswer(
    currentTeam!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
    currentQuestion,
    currentState
  );
  const totalAnswers = phaseOneResponses.reduce((acc, response) => acc + response.teams.length, 0) ?? 0;
  const isPlayerCorrect = selectedAnswer?.isCorrect ?? false;
  console.log(newPoints);
  const P1LeftColumnContents = (
    <ScrollBoxStyled>
      <Stack spacing={2}>
        <QuestionCard questionText={questionText} imageUrl={questionUrl} />
        <DiscussAnswerCard
          instructions={instructions}
          answerStatus={
            isPlayerCorrect
              ? AnswerState.PLAYER_SELECTED_CORRECT
              : AnswerState.CORRECT
          }
          phaseOneResponse={correctResponse}
          currentState={currentState}
          isShortAnswerEnabled={isShortAnswerEnabled}
          newPoints={newPoints}
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
            Swipe left to see the correct answer
        </Typography>
      )}
    </ScrollBoxStyled>
);
  const questionLeftColumnContents = (
      <ScrollBoxStyled>
        <Stack spacing={2}>
          <QuestionCard questionText={questionText} imageUrl={questionUrl} />
          { phaseTwoResponses?.reverse && phaseTwoResponses.map((response, index) => (
            !response.isCorrect &&
              <DiscussAnswerCard
                instructions={instructions ?? ''}
                answerStatus={
                  response.teams.includes(currentTeam.name) 
                    ? AnswerState.SELECTED
                    : AnswerState.DEFAULT
                }
                phaseTwoResponse={response}
                phaseOneResponse={phaseOneResponses.find((p1Response) => p1Response.rawAnswer === response.rawAnswer)}
                answerReason={response.reason ?? ''}
                currentState={currentState}
                key={uuidv4()}
                isShortAnswerEnabled={isShortAnswerEnabled}
                newPoints={newPoints}
                totalAnswers={totalAnswers}
              />
            )
          )}
          { otherResponses && otherResponses.length > 0 && (
              <DiscussAnswerCard
                instructions={instructions ?? ''}
                answerStatus={AnswerState.OTHER}
                answerReason=''
                currentState={currentState}
                key={uuidv4()}
                isShortAnswerEnabled={isShortAnswerEnabled}
                newPoints={newPoints}
                otherAnswersCount={otherResponses.reduce((acc, response) => acc + response.count, 0) ?? 0}
                totalAnswers={totalAnswers}
              />
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
            Swipe left to see the correct answer
          </Typography>
        )}
      </ScrollBoxStyled>
  );

  const questionRightColumnContents = (
      <ScrollBoxStyled>
        <Stack spacing={2}>
          <AnswerResponsesCard isShortAnswerEnabled={isShortAnswerEnabled} phaseOneResponses={phaseOneResponses} phaseTwoResponses={phaseTwoResponses} otherResponses={otherResponses} currentTeam={currentTeam}/>
          <DiscussAnswerCard
            instructions={instructions}
            answerStatus={
              isPlayerCorrect
                ? AnswerState.PLAYER_SELECTED_CORRECT
                : AnswerState.CORRECT
            }
            phaseOneResponse={correctResponse}
            phaseTwoResponse={correctResponse}
            currentState={currentState}
            isShortAnswerEnabled={isShortAnswerEnabled}
            newPoints={newPoints}
            totalAnswers={totalAnswers}
          />
        </Stack>
      </ScrollBoxStyled>
  );

  return currentState === GameSessionState.PHASE_2_DISCUSS ? ( // eslint-disable-line
    isSmallDevice ? (
      <BodyContentAreaTripleColumnStyled
        container
        gap='16px'
      >
        <Grid item xs={12} sm style={{ width: `100%`, height: '100%'}}>
            <Swiper
              modules={[Pagination]}
              spaceBetween='8px'
              centeredSlides
              slidesPerView={1.2}
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
        </Grid>
        </BodyContentAreaTripleColumnStyled>
      ):(
        <BodyContentAreaTripleColumnStyledNoSwiper
          container
          gap='16px'
        >
          <Grid item xs={0} sm sx={{ width: '100%', height: '100%' }}>
            {questionLeftColumnContents}
          </Grid>
          <Grid item xs={0} sm sx={{ width: '100%', height: '100%' }}>
            {questionRightColumnContents}
          </Grid>
        </BodyContentAreaTripleColumnStyledNoSwiper>
      )
    ) : (
      <BodyContentAreaSingleColumnStyled>
        <Box sx={{ width: '100%', maxWidth: `calc(400px + ${theme.sizing.mediumPadding * 2}px)`, height: '100%' }}>
          {P1LeftColumnContents}
        </Box>
      </BodyContentAreaSingleColumnStyled>
  );
}