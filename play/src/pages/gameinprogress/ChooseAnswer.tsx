import React, { useEffect, useRef } from 'react';
import { useTheme } from '@mui/material/styles';
import { Typography, Grid, Fade, Box, useMediaQuery } from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  ConfidenceLevel,
  GameSessionState,
  BackendAnswer,
  IChoice,
  ITeam,
  IAnswerHint,
  IAnswerSettings,
  IAPIClients
} from '@righton/networking';
import { Pagination } from 'swiper';
import { Swiper, SwiperSlide, SwiperRef } from 'swiper/react';
import { BodyContentAreaDoubleColumnStyled, BodyContentAreaDoubleColumnStyledNoSwiper } from '../../lib/styledcomponents/layout/BodyContentAreasStyled';
import QuestionCard from '../../components/QuestionCard';
import AnswerCard from '../../components/AnswerCard';
import OpenAnswerCard from '../../components/OpenAnswerCard';
import HintCard from '../../components/HintCard';
import ConfidenceMeterCard from '../../components/ConfidenceMeterCard';
import ScrollBoxStyled from '../../lib/styledcomponents/layout/ScrollBoxStyled';
import { ScreenSize, PADDING_LEFTRIGHT_BY_SIZE } from '../../lib/PlayModels';
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

interface ChooseAnswerProps {
  apiClients: IAPIClients;
  isSmallDevice: boolean;
  questionText: string;
  questionUrl: string;
  answerSettings: IAnswerSettings | null;
  answerChoices: IChoice[] | undefined;
  isSubmitted: boolean;
  displaySubmitted: boolean;
  handleSubmitAnswer: (answer: BackendAnswer) => void;
  currentState: GameSessionState;
  handleSelectAnswer: (answer: string, multiChoiceCharacter: string) => void;
  isConfidenceEnabled: boolean;
  selectedConfidenceOption: string;
  handleSelectConfidence: (confidence: ConfidenceLevel) => void;
  isConfidenceSelected: boolean;
  isTimeUp: boolean;
  isShortAnswerEnabled: boolean;
  backendAnswer: BackendAnswer;
  currentQuestionIndex: number;
  answerHint: IAnswerHint | null;
  isHintEnabled: boolean;
  handleSubmitHint: (result: IAnswerHint) => void;
  isHintSubmitted: boolean;
  currentTeam: ITeam | null;
  questionId: string;
  teamMemberAnswersId: string;
  gameSessionId: string;
}

export default function ChooseAnswer({
  apiClients,
  isSmallDevice,
  questionText,
  questionUrl,
  answerSettings,
  answerChoices,
  isSubmitted,
  displaySubmitted,
  handleSubmitAnswer,
  currentState,
  handleSelectAnswer,
  isConfidenceEnabled,
  selectedConfidenceOption,
  handleSelectConfidence,
  isConfidenceSelected,
  isTimeUp,
  isShortAnswerEnabled,
  backendAnswer,
  currentQuestionIndex,
  answerHint,
  isHintEnabled,
  handleSubmitHint,
  isHintSubmitted,
  currentTeam,
  questionId,
  teamMemberAnswersId,
  gameSessionId,
}: ChooseAnswerProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const swiperRef = useRef<SwiperRef>(null);
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  let screenSize = ScreenSize.MEDIUM;
  if (isLargeScreen) screenSize = ScreenSize.LARGE;
  else if (isSmallDevice) screenSize = ScreenSize.SMALL;

  useEffect(() => {
    if (isSubmitted && isSmallDevice && swiperRef?.current?.swiper.activeIndex !== 0 && 
      ((isConfidenceEnabled && currentState === GameSessionState.CHOOSE_CORRECT_ANSWER)
       || (isHintEnabled && currentState === GameSessionState.CHOOSE_TRICKIEST_ANSWER))) {
      swiperRef?.current?.swiper.slideTo(swiperRef?.current?.swiper?.slides.length);
    }
  }, [isSubmitted, isConfidenceEnabled, isHintEnabled, isSmallDevice, currentState, swiperRef]);
  const questionContents = (
    <Grid item xs={12} sm style={{ 
      width: '100%',
      height: '100%', 
    }}>
    <ScrollBoxStyled>
      <QuestionCard questionText={questionText} imageUrl={questionUrl} />
      {isSmallDevice ? (
        <Typography
          variant="paragraph"
          sx={{
            textAlign: 'center',
            marginTop: `${theme.sizing.largePadding}px`,
          }}
        >
          {t('gameinprogress.general.swipealert')}
        </Typography>
      ) : null}
    </ScrollBoxStyled>
    </Grid>
  );

  const belowCardMessage = (() => {
    if (isTimeUp) {
      return (
        <Typography
          sx={{
            fontWeight: 700,
            marginTop: `${theme.sizing.largePadding}px`,
            marginX: `${theme.sizing.largePadding}px`,
            fontSize: `${theme.typography.h4.fontSize}px`,
            textAlign: 'center',
          }}
        >
          {t('gameinprogress.chooseanswer.answertimeup')}
        </Typography>
      );
    }
    return null;
  })();

  const answerContents = (
    <Grid item xs={12} sm style={{ 
      width: '100%',
      height: '100%', 
    }}>
      <ScrollBoxStyled>
        {isShortAnswerEnabled &&
        currentState === GameSessionState.CHOOSE_CORRECT_ANSWER ? (
          <OpenAnswerCard
            backendAnswer={backendAnswer}
            isSubmitted={backendAnswer.isSubmitted ?? false}
            isShortAnswerEnabled={isShortAnswerEnabled}
            answerSettings={answerSettings}
            currentState={currentState}
            currentQuestionIndex={currentQuestionIndex}
            handleSubmitAnswer={handleSubmitAnswer}
            questionId={questionId}
            teamMemberAnswersId={teamMemberAnswersId}
            currentTeam={currentTeam}
          />
        ) : (
          <AnswerCard
            answers={answerChoices}
            isSubmitted={backendAnswer.isSubmitted ?? false}
            isShortAnswerEnabled={isShortAnswerEnabled}
            handleSubmitAnswer={handleSubmitAnswer}
            currentState={currentState}
            currentQuestionIndex={currentQuestionIndex}
            selectedAnswer={backendAnswer.answer.rawAnswer}
            handleSelectAnswer={handleSelectAnswer}
            questionId={questionId}
            teamMemberAnswersId={teamMemberAnswersId}
            currentTeam={currentTeam}
          />
        )}
        {isSubmitted && !isSmallDevice ? (
          <>
          { isConfidenceEnabled && 
            (currentState === GameSessionState.CHOOSE_CORRECT_ANSWER || currentState === GameSessionState.PHASE_1_DISCUSS) ?
              <Fade in={isSubmitted} timeout={500}>
                <Box style={{ marginTop: CARD_GAP_BY_SIZE[screenSize] }} id="confidencecard-scrollbox">
                  <ConfidenceMeterCard
                    selectedOption={selectedConfidenceOption}
                    handleSelectOption={handleSelectConfidence}
                    isSelected={isConfidenceSelected}
                    isSmallDevice={isSmallDevice}
                    isTimeUp={isTimeUp}
                  />
                </Box>
              </Fade>
            : null }
            {isHintEnabled &&
              currentState === GameSessionState.CHOOSE_TRICKIEST_ANSWER && (
              <Fade in={isSubmitted} timeout={500}>
                <Box style={{ marginTop: CARD_GAP_BY_SIZE[screenSize] }} id="hintcard-scrollbox">
                  <HintCard
                    apiClients={apiClients}
                    answerHintText={answerHint?.rawHint ?? ''}
                    currentState={currentState}
                    currentQuestionIndex={currentQuestionIndex}
                    isHintSubmitted={isHintSubmitted}
                    handleSubmitHint={handleSubmitHint}
                    currentTeam={currentTeam ?? null}
                    questionId={questionId}
                    teamMemberAnswersId={teamMemberAnswersId}
                    gameSessionId={gameSessionId}
                  />
                </Box>
              </Fade>
            )}

            {belowCardMessage}
          </>
        ) : null}
      </ScrollBoxStyled>
    </Grid>
  );
  
  return (
    isSmallDevice ? (
      <BodyContentAreaDoubleColumnStyled
        container
      >
        <Grid item xs={12} sm={6} style={{ width: '100%', height: '100%'}}>
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
            ref={swiperRef}
          >
            <SwiperSlide
              style={{
                width: `calc(100% - ${theme.sizing.mediumPadding * 2}px)`,
                height: '100%',
              }}
            >
              {questionContents}
            </SwiperSlide>
            <SwiperSlide
              style={{
                width: `calc(100% - ${theme.sizing.mediumPadding * 2}px)`,
                height: '100%',
              }}
            >
              {answerContents}
            </SwiperSlide>
            { isSubmitted && isSmallDevice && isConfidenceEnabled &&
                <SwiperSlide
                  style={{
                    width: `calc(100% - ${theme.sizing.mediumPadding * 2}px)`,
                    height: '100%',
                  }}
                >
                   <ScrollBoxStyled>
                   { (isConfidenceEnabled && (currentState === GameSessionState.CHOOSE_CORRECT_ANSWER || currentState === GameSessionState.PHASE_1_DISCUSS)) &&
                      <ConfidenceMeterCard
                        selectedOption={selectedConfidenceOption}
                        handleSelectOption={handleSelectConfidence}
                        isSelected={isConfidenceSelected}
                        isSmallDevice={isSmallDevice}
                        isTimeUp={isTimeUp}
                      />
                   }
                   {isHintEnabled && currentState === GameSessionState.CHOOSE_TRICKIEST_ANSWER  &&
                    <HintCard
                      apiClients={apiClients}
                      answerHintText={answerHint?.rawHint ?? ''}
                      currentState={currentState}
                      currentQuestionIndex={currentQuestionIndex}
                      isHintSubmitted={isHintSubmitted}
                      handleSubmitHint={handleSubmitHint}
                      currentTeam={currentTeam ?? null}
                      questionId={questionId}
                      teamMemberAnswersId={teamMemberAnswersId}
                      gameSessionId={gameSessionId}
                    />
                   }
                   {isTimeUp && (
                     <Typography
                       variant="paragraph"
                       sx={{
                         textAlign: 'center',
                         marginTop: `${theme.sizing.largePadding}px`,
                       }}
                     >
                       {t('gameinprogress.chooseanswer.answertimeup')}
                     </Typography>
                   )}
                  </ScrollBoxStyled>
                </SwiperSlide>
            }
          </Swiper>
          </Grid>
        </BodyContentAreaDoubleColumnStyled>
    ) : (
      <BodyContentAreaDoubleColumnStyledNoSwiper
        container
        gap={COLUMN_GAP_BY_SIZE[screenSize]}
        style={{
          paddingLeft: PADDING_LEFTRIGHT_BY_SIZE[screenSize],
          paddingRight: PADDING_LEFTRIGHT_BY_SIZE[screenSize],
        }}
      >
        {questionContents}
        {answerContents}
      </BodyContentAreaDoubleColumnStyledNoSwiper>
    )
  );
}
