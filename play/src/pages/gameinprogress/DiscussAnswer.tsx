import React, { useEffect, useRef } from 'react';
import { useTheme, styled } from '@mui/material/styles';
import { Typography, Grid, Stack, Box, useMediaQuery } from '@mui/material';
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
import { AnswerState, ScreenSize, PADDING_LEFTRIGHT_BY_SIZE } from '../../lib/PlayModels';
import QuestionCard from '../../components/QuestionCard';
import preloadImages from '../../lib/preloadImages';
import { getWavingMonsterAssets } from '../../components/WavingMonster';
import { getCongratsAssets } from '../finalresults/Congrats';
import DiscussAnswerCard from '../../components/DiscussAnswerCard';
import AnswerResponsesCard from '../../components/AnswerResponses/AnswerResponsesCard';
import ScrollBoxStyled from '../../lib/styledcomponents/layout/ScrollBoxStyled';
import {
  BodyContentAreaDoubleColumnStyledNoSwiper,
  BodyContentAreaTripleColumnStyled,
  BodyContentAreaTripleColumnStyledNoSwiper,
  BodyContentAreaSingleColumnStyled,
} from '../../lib/styledcomponents/layout/BodyContentAreasStyled';
import 'swiper/css';
import 'swiper/css/pagination';

const COLUMN_GAP_BY_SIZE: Record<ScreenSize, string> = {
  [ScreenSize.SMALL]: '16px',
  [ScreenSize.MEDIUM]: '16px',
  [ScreenSize.LARGE]: '24px',
};

const CARD_GAP_BY_SIZE: Record<ScreenSize, string> = {
  [ScreenSize.SMALL]: '16px',
  [ScreenSize.MEDIUM]: '24px',
  [ScreenSize.LARGE]: '24px',
};

interface DiscussAnswerProps {
  isSmallDevice: boolean;
  questionText: string;
  questionUrl: string;
  answerChoices: IChoice[] | undefined;
  instructions: string[];
  currentState: GameSessionState;
  currentTeam: ITeam;
  currentQuestion: IQuestion;
  isShortAnswerEnabled: boolean;
  gameSession: IGameSession;
  newPoints: number | undefined;
  teamAvatar: number;
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
  teamAvatar
}: DiscussAnswerProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const resultCardRef = useRef<HTMLDivElement>(null);

  // Warm the browser cache for the final-results screens while the player is
  // on this (static) discuss screen, so the waving monster and celebrate scene
  // don't render against a blank background on a cold cache.
  useEffect(() => {
    preloadImages([
      ...getWavingMonsterAssets(teamAvatar),
      ...getCongratsAssets(teamAvatar),
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // small-device counterpart of ChooseAnswer's submitted-card autoscroll: the
  // player's result card (phase 1: correct/nice-try, phase 2: their own
  // selection with the points pill; absent when they answered correctly)
  // mounts below the fold, so bring it into view when a discuss phase starts.
  // scrollIntoView would also drag the phase 2 swiper's overflow: hidden
  // container horizontally, so scroll only the nearest vertical scroll
  // ancestor (ScrollBoxStyled)
  useEffect(() => {
    const card = resultCardRef.current;
    if (!isSmallDevice || card == null ||
      (currentState !== GameSessionState.PHASE_1_DISCUSS &&
        currentState !== GameSessionState.PHASE_2_DISCUSS))
      return;
    let scrollBox = card.parentElement;
    while (scrollBox != null && !/auto|scroll/.test(window.getComputedStyle(scrollBox).overflowY))
      scrollBox = scrollBox.parentElement;
    scrollBox?.scrollTo({
      top: card.getBoundingClientRect().top - scrollBox.getBoundingClientRect().top + scrollBox.scrollTop,
      behavior: 'smooth',
    });
  }, [isSmallDevice, currentState]);
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  let screenSize = ScreenSize.MEDIUM;
  if (isLargeScreen) screenSize = ScreenSize.LARGE;
  else if (isSmallDevice) screenSize = ScreenSize.SMALL;
  const phaseOneResponses = currentQuestion?.answerData.phase1.responses.filter((response) => response.multiChoiceCharacter !== '…' || response.isCorrect).reverse();
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
      phaseTwoResponses = currentQuestion?.answerData.phase2.responses.filter((response) => response.multiChoiceCharacter !== '…' || response.isCorrect).reverse(); 
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
  // Phase 1's two cards, defined once so the single-column (small/medium) and
  // two-column (desktop) arrangements below compose the same elements.
  const p1QuestionCard = (
    <QuestionCard questionText={questionText} imageUrl={questionUrl} />
  );
  const p1CorrectAnswerCard = (
    <Box ref={resultCardRef} id="discussanswercard-scrollbox">
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
        selectedAnswer={null}
        teamAvatar={teamAvatar}
      />
    </Box>
  );
  const P1SingleColumnContents = (
    <ScrollBoxStyled>
      <Stack sx={{ gap: CARD_GAP_BY_SIZE[screenSize] }}>
        {p1QuestionCard}
        {p1CorrectAnswerCard}
      </Stack>
    </ScrollBoxStyled>
  );
  const questionLeftColumnContents = (
      <ScrollBoxStyled>
        <Stack sx={{ gap: CARD_GAP_BY_SIZE[screenSize] }}>
          <QuestionCard questionText={questionText} imageUrl={questionUrl} />
          { phaseTwoResponses?.reverse && phaseTwoResponses.map((response, index) => {
            const isPlayerSelection = response.teams.includes(currentTeam.name);
            return (
              !response.isCorrect &&
                <Box
                  key={uuidv4()}
                  ref={isPlayerSelection ? resultCardRef : null}
                  id={isPlayerSelection ? 'selectedanswercard-scrollbox' : undefined}
                >
                  <DiscussAnswerCard
                    instructions={instructions ?? ''}
                    answerStatus={
                      isPlayerSelection
                        ? AnswerState.SELECTED
                        : AnswerState.DEFAULT
                    }
                    phaseTwoResponse={response}
                    phaseOneResponse={phaseOneResponses.find((p1Response) => p1Response.rawAnswer === response.rawAnswer)}
                    answerReason={response.reason ?? ''}
                    currentState={currentState}
                    isShortAnswerEnabled={isShortAnswerEnabled}
                    newPoints={newPoints}
                    totalAnswers={totalAnswers}
                    selectedAnswer={
                      isPlayerSelection
                        ? selectedAnswer
                        : null
                    }
                    teamAvatar={teamAvatar}
                  />
                </Box>
            );
          })}
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
                selectedAnswer={null}
                teamAvatar={teamAvatar}
              />
          )}
        </Stack>
        {isSmallDevice && currentState === GameSessionState.PHASE_2_DISCUSS && (
          <Typography
            variant="paragraph"
            sx={{
              textAlign: 'center',
              marginTop: `${theme.sizing.lgPadding}px`,
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
        <Stack sx={{ gap: CARD_GAP_BY_SIZE[screenSize] }}>
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
            selectedAnswer={null}
            teamAvatar={teamAvatar}
          />
        </Stack>
      </ScrollBoxStyled>
  );

  return currentState === GameSessionState.PHASE_2_DISCUSS ? ( // eslint-disable-line
    isSmallDevice ? (
      <BodyContentAreaTripleColumnStyled
        container
        gap={COLUMN_GAP_BY_SIZE[screenSize]}
      >
        <Grid item xs={12} sm style={{ width: `100%`, height: '100%'}}>
            <Swiper
              modules={[Pagination]}
              spaceBetween={COLUMN_GAP_BY_SIZE[screenSize]}
              centeredSlides
              slidesPerView='auto'
              pagination={{
                el: '.swiper-pagination-container',
                bulletClass: 'swiper-pagination-bullet',
                bulletActiveClass: 'swiper-pagination-bullet-active',
                clickable: true,
                renderBullet(index, className) {
                  return `<span class="${className}" style="width:30px; height:10px; border-radius:8px"></span>`;
                },
              }}
              style={{ height: '100%' }}
            >
              <SwiperSlide
                style={{
                  width: `calc(100% - ${theme.sizing.mdPadding * 2}px)`,
                  height: '100%',
                }}
              >
                {questionLeftColumnContents}
              </SwiperSlide>
              <SwiperSlide
                style={{
                  width: `calc(100% - ${theme.sizing.mdPadding * 2}px)`,
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
          gap={COLUMN_GAP_BY_SIZE[screenSize]}
          style={{
            paddingLeft: PADDING_LEFTRIGHT_BY_SIZE[screenSize],
            paddingRight: PADDING_LEFTRIGHT_BY_SIZE[screenSize],
          }}
        >
          <Grid item xs={0} sm sx={{ width: '100%', height: '100%' }}>
            {questionLeftColumnContents}
          </Grid>
          <Grid item xs={0} sm sx={{ width: '100%', height: '100%' }}>
            {questionRightColumnContents}
          </Grid>
        </BodyContentAreaTripleColumnStyledNoSwiper>
      )
    ) : screenSize === ScreenSize.LARGE ? ( // eslint-disable-line no-nested-ternary
      <BodyContentAreaDoubleColumnStyledNoSwiper
        container
        gap={COLUMN_GAP_BY_SIZE[screenSize]}
        style={{
          paddingLeft: PADDING_LEFTRIGHT_BY_SIZE[screenSize],
          paddingRight: PADDING_LEFTRIGHT_BY_SIZE[screenSize],
        }}
      >
        <Grid item xs={0} sm sx={{ width: '100%', height: '100%' }}>
          <ScrollBoxStyled>
            <Stack sx={{ gap: CARD_GAP_BY_SIZE[screenSize] }}>
              {p1QuestionCard}
            </Stack>
          </ScrollBoxStyled>
        </Grid>
        <Grid item xs={0} sm sx={{ width: '100%', height: '100%' }}>
          <ScrollBoxStyled>
            <Stack sx={{ gap: CARD_GAP_BY_SIZE[screenSize] }}>
              {p1CorrectAnswerCard}
            </Stack>
          </ScrollBoxStyled>
        </Grid>
      </BodyContentAreaDoubleColumnStyledNoSwiper>
  ) : (
      <BodyContentAreaSingleColumnStyled
        style={{
          paddingLeft: PADDING_LEFTRIGHT_BY_SIZE[screenSize],
          paddingRight: PADDING_LEFTRIGHT_BY_SIZE[screenSize],
        }}
      >
        <Box sx={{ width: '100%', maxWidth: `calc(400px + ${theme.sizing.mdPadding * 2}px)`, height: '100%' }}>
          {P1SingleColumnContents}
        </Box>
      </BodyContentAreaSingleColumnStyled>
  );
}