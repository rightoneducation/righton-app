import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Typography, Box } from '@mui/material';
import BodyCardContainerStyled from '../lib/styledcomponents/BodyCardContainerStyled';
import BodyCardStyled from '../lib/styledcomponents/BodyCardStyled';
import AnswerOptionStyled from '../lib/styledcomponents/AnswerOptionStyled';

interface AnswerCardProps {
  isCorrectAnswer: boolean;
  answerIndex: number;
  answerContent: string;
  instructions: string[] | null;
  answerReason: string | null;
}

export default function AnswerCard({
  isCorrectAnswer,
  answerIndex,
  answerContent,
  instructions,
  answerReason,
}: AnswerCardProps) {
  const theme = useTheme(); // eslint-disable-line
  const letterCode = 'A'.charCodeAt(0) + answerIndex;

  const correctAnswerInstruction = (index: number) => {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          marginTop: `${theme.sizing.extraSmallPadding}px`,
        }}
      >
        <Typography
          sx={{
            marginLeft: `${theme.sizing.smallPadding}px`,
            fontSize: `${theme.typography.h3.fontSize}px`,
            fontWeight: `${theme.typography.h3.fontWeight}`,
            color: `${theme.palette.primary.darkPurple}`,
          }}
        >
          {index + 1}
        </Typography>
        <Typography
          sx={{
            marginLeft: `${theme.sizing.extraSmallPadding}px`,
          }}
        >
          {instructions !== null ? instructions[index] : null}
        </Typography>
      </Box>
    );
  };

  const incorrectAnswerReasoning = () => {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          marginTop: `${theme.sizing.extraSmallPadding}px`,
        }}
      >
        <Typography
          sx={{
            marginLeft: `${theme.sizing.extraSmallPadding}px`,
          }}
        >
          {answerReason}
        </Typography>
      </Box>
    );
  };

  return (
    <BodyCardStyled elevation={10}>
      <BodyCardContainerStyled sx={{ alignItems: 'flex-start' }}>
        <Box sx={{ width: '100%' }}>
          <AnswerOptionStyled
            sx={{
              backgroundColor: isCorrectAnswer
                ? theme.palette.primary.correctColor
                : theme.palette.primary.lightGrey,
            }}
          >
            <Typography
              sx={{
                marginRight: `${theme.sizing.extraSmallPadding}px`,
                fontWeight: `${theme.typography.h5.fontWeight}`,
                opacity: 0.5,
              }}
            >
              {String.fromCharCode(letterCode)}
            </Typography>
            <Typography>{answerContent}</Typography>
          </AnswerOptionStyled>
          <BodyCardContainerStyled sx={{ alignItems: 'flex-start' }}>
            {isCorrectAnswer && instructions !== null
              ? instructions.map((instruction) =>
                  correctAnswerInstruction(instructions.indexOf(instruction)),
                )
              : incorrectAnswerReasoning()}
          </BodyCardContainerStyled>
        </Box>
      </BodyCardContainerStyled>
    </BodyCardStyled>
  );
}
