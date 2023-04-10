import React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Paper, Typography, Stack } from '@mui/material';
import { isNullOrUndefined, GameSessionState } from '@righton/networking';
import AnswerSelector from './AnswerSelector';
import ButtonSubmitAnswer from './ButtonSubmitAnswer';
import AnswerState from '../lib/PlayModels';

const BodyCard = styled(Paper)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginLeft: '16px',
  marginRight: '16px',
  marginTop: '24px',
  marginBottom: '24px',
  borderRadius: '24px',
  padding: '16px',
  backgroundColor: theme.palette.primary.main,
}));

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
    <>
       <Typography display="inline" variant="h4" > Choose the </Typography> 
       <Typography display="inline" variant="h4" sx={{ color: `${theme.palette.primary.greenText}`}}> correct answer</Typography>
    </>
  );
  const trickText = (
    <>
    <Typography display="inline" variant="h4"> What do you think is the most popular </Typography>
    <Typography display="inline" variant = "h4"
        sx={{ color: `${theme.palette.primary.redText}`, display: 'inline' }}
      > trick answer </Typography> 
    <Typography display="inline" variant="h4">
      among your class?
    </Typography>
    </>
  );

  return (
    <BodyCard elevation={3}>
      {currentState === GameSessionState.CHOOSE_CORRECT_ANSWER
        ? correctText
        : trickText}
      <AnswerContainer> {/* spacing between elements handled in AnswerSelector component (so border thicknesses can be handled) */}
        {answers?.map((answer, index) => (
          <AnswerSelector
            answerStatus={selectedAnswer === index ? AnswerState.SELECTED : AnswerState.DEFAULT}
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
    </BodyCard>
  );
}
