import React from 'react';
import { Typography, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { v4 as uuidv4 } from 'uuid';
import {
  BaseCardStyled,
  QuestionTitleStyled,
  AnswerIndicator,
} from '../../../lib/styledcomponents/DetailedQuestionStyledComponents';
import { CardType } from '../../../lib/CentralModels';

interface DetailedQuestionSubCardProps {
  cardType: CardType;
}

export default function DetailedQuestionSubCard (
  { cardType }: DetailedQuestionSubCardProps
) {
  const theme = useTheme();
  const [questionType, setQuestionType] = React.useState<string>('A'); 
  const instructions: any[] = [];
  const answerReason = 'This is the reason for the incorrect answer.';
  const correctAnswerInstruction = (index: number) => {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          marginTop: `${theme.sizing.xSmPadding}px`,
        }}
        key={uuidv4()}
      >
        <Typography
          sx={{
            marginLeft: `${theme.sizing.smPadding}px`,
            fontSize: `${theme.typography.h3.fontSize}px`,
            fontWeight: `${theme.typography.h3.fontWeight}`,
            color: `${theme.palette.primary.darkPurple}`,
            opacity: 0.5
          }}
        >
          {index + 1}
        </Typography>
        <Typography
          sx={{
            marginLeft: `${theme.sizing.xSmPadding}px`,
          }}
        >
          {instructions !== null ? instructions[index] : null}
        </Typography>
      </Box>
    );
  };

  const incorrectAnswerReasoning = [
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          marginTop: `${theme.sizing.xSmPadding}px`,
        }}
      >
        <Typography
          sx={{
            marginLeft: `${theme.sizing.xSmPadding}px`,
          }}
        >
          {answerReason}
        </Typography>
      </Box>
  ];

  const answer = 'a';
  return (
    <BaseCardStyled>
      <QuestionTitleStyled>
        {cardType === CardType.CORRECT ? 'Correct' : 'Incorrect'} Answer
      </QuestionTitleStyled>
      <AnswerIndicator>
        {answer}
      </AnswerIndicator>
      {cardType === CardType.CORRECT && instructions !== null
        ? instructions.map((instruction) =>
            correctAnswerInstruction(instructions.indexOf(instruction)),
          )
        : incorrectAnswerReasoning}
    </BaseCardStyled>
  );
}