import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Typography, Stack, Box } from '@mui/material';
import { isNullOrUndefined, GameSessionState } from '@righton/networking';
import AnswerSelector from './AnswerSelector';
import ButtonSubmitAnswer from './ButtonSubmitAnswer';
import { AnswerState } from '../lib/PlayModels';
import BodyCardStyled from '../lib/styledcomponents/BodyCardStyled';
import BodyCardContainerStyled from '../lib/styledcomponents/BodyCardContainerStyled';

interface AnswerCardProps {
  answers: { text: string; isCorrectAnswer: boolean }[] | undefined;
  isSubmitted: boolean;
  handleSubmitAnswer: () => void;
  currentState: GameSessionState;
  selectedAnswer: number | null;
  handleSelectAnswer: (index: number) => void;
}

export default function AnswerCard({
  answers,
  isSubmitted,
  handleSubmitAnswer,
  currentState,
  selectedAnswer,
  handleSelectAnswer,
}: AnswerCardProps) {
  const theme = useTheme();
  const correctText = (
    <Box display="inline" sx={{ textAlign: 'center' }}>
      <Typography variant="h4" display="inline">
        {' '}
        Choose the{' '}
      </Typography>
      <Typography
        variant="h4"
        display="inline"
        sx={{ color: `${theme.palette.primary.green}` }}
      >
        correct answer
      </Typography>
    </Box>
  );
  const trickText = (
    <Box display="inline" sx={{ textAlign: 'center' }}>
      <Typography variant="h4" display="inline">
        What do you think is the most popular&nbsp;
      </Typography>
      <Typography
        display="inline"
        variant="h4"
        sx={{ color: `${theme.palette.primary.red}` }}
      >
        trick answer&nbsp;
      </Typography>
      <Typography variant="h4" display="inline">
        among your class?
      </Typography>
    </Box>
  );

  return (
    <BodyCardStyled elevation={5}>
      <BodyCardContainerStyled spacing={2}>
        {currentState === GameSessionState.CHOOSE_CORRECT_ANSWER
          ? correctText
          : trickText}
        <Stack spacing={2} sx={{ width: '100%' }}>
          {answers?.map((answer, index) => (
            <AnswerSelector
              answerStatus={
                selectedAnswer === index
                  ? AnswerState.SELECTED
                  : AnswerState.DEFAULT
              }
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
          handleSubmitAnswer={handleSubmitAnswer}
          isSelected={!isNullOrUndefined(selectedAnswer)}
        />
      </BodyCardContainerStyled>
    </BodyCardStyled>
  );
}
