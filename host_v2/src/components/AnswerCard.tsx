import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Typography, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import BodyCardContainerStyled from '../lib/styledcomponents/BodyCardContainerStyled';
import BodyCardStyled from '../lib/styledcomponents/BodyCardStyled';

interface AnswerCardProps {
  isCorrectAnswer: boolean,
  answerIndex: number,
  answerContent: string,
  instructions: string[],
  answerReason: string
}


export default function AnswerCard({
  isCorrectAnswer,
  answerIndex,
  answerContent,
  instructions,
  answerReason
}: AnswerCardProps) {
  const theme = useTheme(); // eslint-disable-line
  const { t } = useTranslation();
  const letterCode = 'A'.charCodeAt(0) + answerIndex;

  const correctAnswerInstruction = (index: number) => {
    return (
      <Box sx={{ // TODO: maybe make this a standardized style component in host_v2>src>lib>styledcomponents
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginTop: `${theme.sizing.extraSmallPadding}px`
      }}>
        <Typography sx={{
          marginLeft: `${theme.sizing.smallPadding}px`,
          fontSize: `${theme.typography.h3.fontSize}px`,
          fontWeight: `${theme.typography.h3.fontWeight}`,
          color: `${theme.palette.primary.darkPurple}`
        }}>
          {index + 1}
        </Typography>
        <Typography sx={{
          marginLeft: `${theme.sizing.extraSmallPadding}px`
        }}>
          {instructions[index]}
        </Typography>
      </Box >);
  }
  return (
    <BodyCardStyled elevation={10}>
      <BodyCardContainerStyled sx={{ alignItems: 'flex-start' }}>
        <Box sx={{ width: '100%' }}>
          <Box sx={{ // TODO: maybe make this a standardized style component in host_v2>src>lib>styledcomponents
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            borderRadius: '22px', // TODO: change this later to theme reference value
            padding: `${theme.sizing.smallPadding}px`,
            backgroundColor: isCorrectAnswer ? theme.palette.primary.correctColor : theme.palette.primary.lightGrey
          }}>
            <Typography sx={{
              marginRight: `${theme.sizing.extraSmallPadding}px`,
              fontWeight: `${theme.typography.h5.fontWeight}`,
              opacity: 0.5
            }}>{String.fromCharCode(letterCode)}</Typography>
            <Typography>{answerContent}</Typography>
          </Box>
          <BodyCardContainerStyled sx={{ alignItems: 'flex-start' }}>
            {isCorrectAnswer ? instructions.map(instruction => correctAnswerInstruction(instructions.indexOf(instruction))) : answerReason}
          </BodyCardContainerStyled>
        </Box>
      </BodyCardContainerStyled>
    </BodyCardStyled>
  )
}
