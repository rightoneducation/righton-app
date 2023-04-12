import React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Paper, Typography, Stack, Box, Container} from '@mui/material';
import { isNullOrUndefined, GameSessionState } from '@righton/networking';
import AnswerSelector from './AnswerSelector';
import ButtonSubmitAnswer from './ButtonSubmitAnswer';
import AnswerState from '../lib/PlayModels';
import { BodyCard, BodyCardContainer } from '../lib/styledcomponents/BodyCardComponents';


interface CardAnswerProps {
  answers: { text: string; isCorrectAnswer: boolean }[] | undefined;
  isSubmitted: boolean;
  handleSubmitAnswer: () => void;
  currentState: GameSessionState;
  selectedAnswer: number | null;
  handleSelectAnswer: (index: number) => void;
}

export default function CardAnswer({
  answers,
  isSubmitted,
  handleSubmitAnswer,
  currentState,
  selectedAnswer,
  handleSelectAnswer,
}: CardAnswerProps) {
  const theme = useTheme();
  const correctText = (
    <Box display="flex" alignContent="flex-start">
      <Typography variant="h4"> Choose the&nbsp; </Typography>
      <Typography
        variant="h4"
        sx={{ color: `${theme.palette.primary.greenText}` }}
      >
        correct answer
      </Typography>
    </Box>
  );
  const trickText = (
    <Box display="flex" alignContent="flex-start">
      <Typography variant="h4" >
        What do you think is the most popular&nbsp;
      </Typography>
      <Typography
        display="inline"
        variant="h4"
        sx={{ color: `${theme.palette.primary.redText}`, display: 'inline' }}
      >
        trick answer
      </Typography>
      <Typography variant="h4"> &nbsp;among your class? </Typography>
    </Box>
  );

  return (
    <BodyCard elevation={5}>
      <BodyCardContainer spacing={2}>
        {currentState === GameSessionState.CHOOSE_CORRECT_ANSWER
          ? correctText
          : trickText}
        <Stack spacing={2} sx={{width: '100%'}}>
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
      </BodyCardContainer>
    </BodyCard>
  );
}
