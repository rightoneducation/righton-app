import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Typography, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { GameSessionState } from '@righton/networking';
import { Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { BodyContentAreaDoubleColumnStyled } from '../../lib/styledcomponents/layout/BodyContentAreasStyled';
import QuestionCard from '../../components/QuestionCard';
import AnswerCard from '../../components/AnswerCard';
import ScrollBoxStyled from '../../lib/styledcomponents/layout/ScrollBoxStyled';
import 'swiper/css';
import 'swiper/css/pagination';

interface ChooseAnswerProps {
  isSmallDevice: boolean;
  questionText: string[];
  questionUrl: string;
  answerChoices: { text: string; isCorrectAnswer: boolean }[] | undefined;
  isSubmitted: boolean;
  handleSubmitAnswer: (answerText: string) => void;
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
}: ChooseAnswerProps) {
  const theme = useTheme();
  const { t } = useTranslation();
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
        {t('gameinprogress.chooseanswer.questioncolumn')}
      </Typography>
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
        {t('gameinprogress.chooseanswer.answercolumn')}
      </Typography>
      <ScrollBoxStyled>
        <AnswerCard
          answers={answerChoices}
          isSubmitted={isSubmitted}
          handleSubmitAnswer={handleSubmitAnswer}
          currentState={currentState}
          selectedAnswer={selectedAnswer}
          handleSelectAnswer={handleSelectAnswer}
        />
        {isSubmitted ? (
          <>
            <Typography
              variant="body1"
              sx={{
                fontWeight: 700,
                textAlign: 'center',
                marginTop: `${theme.sizing.largePadding}px`,
              }}
            >
              {t('gameinprogress.chooseanswer.answerthankyou1')}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontWeight: 700,
                textAlign: 'center',
                marginTop: `${theme.sizing.largePadding}px`,
              }}
            >
              {t('gameinprogress.chooseanswer.answerthankyou2')}
            </Typography>
          </>
        ) : null}
      </ScrollBoxStyled>
    </>
  );

  return (
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