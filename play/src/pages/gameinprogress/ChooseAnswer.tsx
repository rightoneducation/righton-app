import React, { useEffect, useRef } from 'react';
import { useTheme } from '@mui/material/styles';
import { Typography, Grid, Fade, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  ConfidenceLevel,
  GameSessionState,
  BackendAnswer,
  IChoice,
  ITeam,
  IAnswerHint,
  IAnswerSettings
} from '@righton/networking';
import { Pagination } from 'swiper';
import { Swiper, SwiperSlide, SwiperRef } from 'swiper/react';
import { BodyContentAreaDoubleColumnStyled } from '../../lib/styledcomponents/layout/BodyContentAreasStyled';
import QuestionCard from '../../components/QuestionCard';
import AnswerCard from '../../components/AnswerCard';
import OpenAnswerCard from '../../components/OpenAnswerCard';
import HintCard from '../../components/HintCard';
import ConfidenceMeterCard from '../../components/ConfidenceMeterCard';
import ScrollBoxStyled from '../../lib/styledcomponents/layout/ScrollBoxStyled';
import 'swiper/css';
import 'swiper/css/pagination';

interface ChooseAnswerProps {
  isSmallDevice: boolean;
  questionText: string[];
  questionUrl: string;
  answerSettings: IAnswerSettings | null;
  answerChoices: IChoice[] | undefined;
  isSubmitted: boolean;
  displaySubmitted: boolean;
  handleSubmitAnswer: (answer: BackendAnswer) => void;
  currentState: GameSessionState;
  handleSelectAnswer: (answer: string) => void;
  isConfidenceEnabled: boolean;
  selectedConfidenceOption: string;
  handleSelectConfidence: (confidence: ConfidenceLevel) => void;
  isConfidenceSelected: boolean;
  timeOfLastConfidenceSelect: number;
  setTimeOfLastConfidenceSelect: (time: number) => void;
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
}

export default function ChooseAnswer({
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
  timeOfLastConfidenceSelect,
  setTimeOfLastConfidenceSelect,
  isShortAnswerEnabled,
  backendAnswer,
  currentQuestionIndex,
  answerHint,
  isHintEnabled,
  handleSubmitHint,
  isHintSubmitted,
  currentTeam,
  questionId,
  teamMemberAnswersId
}: ChooseAnswerProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const swiperRef = useRef<SwiperRef>(null);
  useEffect(() => {
    if (isSubmitted && isSmallDevice && swiperRef?.current?.swiper.activeIndex !== 0 && 
      ((isConfidenceEnabled && currentState === GameSessionState.CHOOSE_CORRECT_ANSWER)
       || (isHintEnabled && currentState === GameSessionState.CHOOSE_TRICKIEST_ANSWER))) {
      swiperRef?.current?.swiper.slideTo(swiperRef?.current?.swiper?.slides.length);
    }
  }, [isSubmitted, isConfidenceEnabled, isHintEnabled, isSmallDevice, currentState, swiperRef]);
  const questionContents = (
    <ScrollBoxStyled>
      <QuestionCard questionText={questionText} imageUrl={questionUrl} />
      {isSmallDevice ? (
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
      ) : null}
    </ScrollBoxStyled>
  );

  const onSubmitDisplay = (
    currentState === GameSessionState.CHOOSE_CORRECT_ANSWER && (
      <Typography
        sx={{
          fontWeight: 700,
          marginTop: `${theme.sizing.largePadding}px`,
          marginX: `${theme.sizing.largePadding}px`,
          fontSize: `${theme.typography.h4.fontSize}px`,
          textAlign: 'center',
        }}
      >
        {t('gameinprogress.chooseanswer.answerthankyou1')}
      </Typography>
    )
  );
  const answerContents = (
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
              <Box style={{ marginTop: !isSmallDevice ? `${theme.sizing.mediumPadding}px` : 0 }} id="confidencecard-scrollbox">
                <ConfidenceMeterCard
                  selectedOption={selectedConfidenceOption}
                  handleSelectOption={handleSelectConfidence}
                  isSelected={isConfidenceSelected}
                  isSmallDevice={isSmallDevice}
                  timeOfLastSelect={timeOfLastConfidenceSelect}
                  setTimeOfLastSelect={setTimeOfLastConfidenceSelect}
                />
              </Box>
            </Fade>
          : null }
          {isHintEnabled &&
            currentState === GameSessionState.CHOOSE_TRICKIEST_ANSWER && (
            <Fade in={isSubmitted} timeout={500}>
              <Box style={{ marginTop: !isSmallDevice ? `${theme.sizing.mediumPadding}px` : 0 }} id="hintcard-scrollbox">
                <HintCard
                  answerHintText={answerHint?.rawHint ?? ''}
                  currentState={currentState}
                  currentQuestionIndex={currentQuestionIndex}
                  isHintSubmitted={isHintSubmitted}
                  handleSubmitHint={handleSubmitHint}
                  currentTeam={currentTeam ?? null}
                  questionId={questionId}
                  teamMemberAnswersId={teamMemberAnswersId}
                />
              </Box>
            </Fade>
          )}

           {displaySubmitted ? onSubmitDisplay : null}
          <Typography
            sx={{
              fontWeight: 700,
              marginTop: `${theme.sizing.largePadding}px`,
              marginX: `${theme.sizing.largePadding}px`,
              fontSize: `${theme.typography.h4.fontSize}px`,
              textAlign: 'center',
            }}
          >
            {t('gameinprogress.chooseanswer.answerthankyou2')}
          </Typography>
        </>
      ) : null}
    </ScrollBoxStyled>
  );
  
  return (
    <BodyContentAreaDoubleColumnStyled
      container
      spacing={isSmallDevice ? 0 : 2}
      style={{ paddingTop: '16px' }}
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
            ref={swiperRef}
          >
            <SwiperSlide
              style={{
                width: `calc(100% - ${theme.sizing.largePadding * 2}px`,
                height: '100%',
              }}
            >
              {questionContents}
            </SwiperSlide>
            <SwiperSlide
              style={{
                width: `calc(100% - ${theme.sizing.largePadding * 2}px`,
                height: '100%',
              }}
            >
              {answerContents}
            </SwiperSlide>
            { isSubmitted && isSmallDevice && isConfidenceEnabled &&
         
                <SwiperSlide
                  style={{
                    width: `calc(100% - ${theme.sizing.largePadding * 2}px`,
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
                        timeOfLastSelect={timeOfLastConfidenceSelect}
                        setTimeOfLastSelect={setTimeOfLastConfidenceSelect}
                      />
                   }
                   {isHintEnabled && currentState === GameSessionState.CHOOSE_TRICKIEST_ANSWER  &&
                    <HintCard
                      answerHintText={answerHint?.rawHint ?? ''}
                      currentState={currentState}
                      currentQuestionIndex={currentQuestionIndex}
                      isHintSubmitted={isHintSubmitted}
                      handleSubmitHint={handleSubmitHint}
                      currentTeam={currentTeam ?? null}
                      questionId={questionId}
                      teamMemberAnswersId={teamMemberAnswersId}
                    />
                   }
                  </ScrollBoxStyled>
                </SwiperSlide>
            }
          </Swiper>
        ) : (
          questionContents
        )}
      </Grid>
      <Grid item xs={0} sm={6} sx={{ width: '100%', height: '100%' }}>
        {answerContents}
      </Grid>
    </BodyContentAreaDoubleColumnStyled>
  );
}
