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
  answer: string;
  instructions?: string[];
  answerReason?: string;
}

export default function DetailedQuestionSubCard({
  cardType,
  answer,
  instructions,
  answerReason,
}: DetailedQuestionSubCardProps) {
  const theme = useTheme();
  const [questionType, setQuestionType] = React.useState<string>('A');

  const correctAnswerInstruction = (index: number) => {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          marginTop: `${theme.sizing.xSmPadding}px`,
          gap: `${theme.sizing.mdPadding}px`,
        }}
        key={uuidv4()}
      >
        <Typography
          sx={{
            fontFamily: 'Poppins',
            fontSize: `16px`,
            fontWeight: 700,
            color: `${theme.palette.primary.darkBlue}`,
          }}
        >
          Step {index + 1}
        </Typography>
        <Typography
          sx={{
            marginLeft: `10px`,
            whiteSpace: 'pre-line', 
          }}
        >
          {instructions ? instructions[index] : null}
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
          whiteSpace: 'pre-line', 
        }}
      >
        {answerReason}
      </Typography>
    </Box>,
  ];
  return (
    <BaseCardStyled elevation={6} style={{gap: `${theme.sizing.smPadding}px`}}>
      <QuestionTitleStyled style={{ color: cardType === CardType.CORRECT ? '#148700' : '#000000' }}>
        {cardType === CardType.CORRECT ? 'Correct' : 'Incorrect'} Answer
      </QuestionTitleStyled>
      <AnswerIndicator>{answer}</AnswerIndicator>
      <QuestionTitleStyled>
      {cardType === CardType.CORRECT && ('Solution')} Explanation
      </QuestionTitleStyled>
      {cardType === CardType.CORRECT && instructions
        ? instructions.map((instruction, index) =>
            correctAnswerInstruction(index),
          )
        : incorrectAnswerReasoning}
    </BaseCardStyled>
  );
}
