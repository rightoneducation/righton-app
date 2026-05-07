import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Typography, Stack, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  isNullOrUndefined,
  GameSessionState,
  BackendAnswer,
  IChoice,
  ITeam
} from '@righton/networking';
import AnswerSelector from './AnswerSelector';
import ButtonSubmitAnswer from './ButtonSubmitAnswer';
import { AnswerState } from '../lib/PlayModels';
import BodyCardStyled from '../lib/styledcomponents/BodyCardStyled';
import BodyCardContainerStyled from '../lib/styledcomponents/BodyCardContainerStyled';

interface AnswerCardProps {
  answers: IChoice[] | undefined;
  isSubmitted: boolean;
  isShortAnswerEnabled: boolean;
  handleSubmitAnswer: (answerText: BackendAnswer) => void;
  currentState: GameSessionState;
  currentQuestionIndex: number;
  selectedAnswer: string | null;
  questionId: string;
  teamMemberAnswersId: string;
  currentTeam: ITeam | null;
  handleSelectAnswer: (answerText: string, multiChoiceCharacter: string) => void;
}

export default function AnswerCard({
  answers,
  isSubmitted,
  isShortAnswerEnabled,
  handleSubmitAnswer,
  currentState,
  currentQuestionIndex,
  selectedAnswer,
  questionId,
  teamMemberAnswersId,
  currentTeam,
  handleSelectAnswer,
}: AnswerCardProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const correctText = (
    <Box display="inline" style={{ width: '100%' }}>
      <Typography variant="h1" sx={{ width: '100%', textAlign: 'left', color: theme.palette.designSystem.surface.play }}>
        {t('gameinprogress.chooseanswer.answercard')}
      </Typography>
    </Box>
  );
  const trickText = (
    <Box display="inline" sx={{ textAlign: 'left' }}>
      <Typography variant="h2" display="inline"  sx={{ fontWeight: 400, color: theme.palette.designSystem.surface.play }}>
        {t('gameinprogress.chooseanswer.incorrecttext1')}
      </Typography>
      <Typography variant="h2" display="inline"  sx={{  color: theme.palette.designSystem.surface.play }}>
        {t('gameinprogress.chooseanswer.incorrecttext2')}
      </Typography>
    </Box>
  );
  const getAnswerStatus = (
    answer: { text: string; isAnswer: boolean },
    index: number
  ) => {
    if (selectedAnswer === answer.text) return AnswerState.SELECTED;
    if (
      answer.isAnswer &&
      currentState === GameSessionState.CHOOSE_TRICKIEST_ANSWER
    )
      return AnswerState.CORRECT;
    return AnswerState.DEFAULT;
  };

  return (
    <BodyCardStyled elevation={10} >
      <BodyCardContainerStyled spacing={2} >
        {currentState === GameSessionState.CHOOSE_CORRECT_ANSWER
          ? correctText
          : trickText}
        <Stack spacing={2} sx={{ width: '100%' }}>
          {answers?.map((answer, index) => (
            <AnswerSelector
              answerStatus={getAnswerStatus(answer, index)}
              isSubmitted={isSubmitted}
              index={index}
              answerText={answer.text}
              key={answer.text}
              handleSelectAnswer={handleSelectAnswer}
            />
          ))}
        </Stack>
        <ButtonSubmitAnswer
          isSubmitted={isSubmitted}
          isShortAnswerEnabled={isShortAnswerEnabled}
          isHint={false}
          selectedAnswer={selectedAnswer}
          answers={answers}
          currentState={currentState}
          currentQuestionIndex={currentQuestionIndex}
          handleSubmitAnswer={handleSubmitAnswer}
          isSelected={selectedAnswer !== '' }
          questionId={questionId}
          teamMemberAnswersId={teamMemberAnswersId}
          currentTeam={currentTeam}
        />
      </BodyCardContainerStyled>
    </BodyCardStyled>
  );
}