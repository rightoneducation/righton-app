import React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Paper, Typography, Stack, Box } from '@mui/material';
import { isNullOrUndefined, GameSessionState } from '@righton/networking';
import AnswerSelector from './AnswerSelector';
import ButtonSubmitAnswer from './ButtonSubmitAnswer';
import AnswerState from '../lib/PlayModels';

const BodyCard = styled(Paper)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  borderRadius: '24px',
  backgroundColor: theme.palette.primary.main,
}));

const CardContainer = styled(Stack)({
  marginTop: '24px',
  marginLeft: '16px',
  marginRight: '16px',
  marginBottom: '24px',
  alignItems: 'center',
});

const AnswerContainer = styled(Stack)({
  width: '100%',
  marginTop: '20px',
  marginBottom: '20px',
});

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
      <Typography variant="h4">
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
      <CardContainer>
        {currentState === GameSessionState.CHOOSE_CORRECT_ANSWER
          ? correctText
          : trickText}
        <AnswerContainer>
          {/* spacing between elements handled in AnswerSelector component (so border thicknesses can be handled) */}
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
        </AnswerContainer>
        <ButtonSubmitAnswer
          isSubmitted={isSubmitted}
          handleSubmitAnswer={handleSubmitAnswer}
          isSelected={!isNullOrUndefined(selectedAnswer)}
        />
      </CardContainer>
    </BodyCard>
  );
}
