import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Typography, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import BodyCardContainerStyled from '../lib/styledcomponents/BodyCardContainerStyled';
import BodyCardStyled from '../lib/styledcomponents/BodyCardStyled';

interface AnswerCardProps {
  isCorrectAnswer: boolean,
  instructions: string[],
  answerReason: string
}

export default function AnswerCard({
  isCorrectAnswer,
  instructions,
  answerReason
}: AnswerCardProps) {
  const theme = useTheme(); // eslint-disable-line
  const { t } = useTranslation();
  return (
    <BodyCardStyled elevation={10}>
      <BodyCardContainerStyled sx={{ alignItems: 'flex-start' }}>
        <Box sx={{ width: '100%' }}>
          <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            borderRadius: '22px', // TODO: change this later to theme reference value
            padding: `${theme.sizing.smallPadding}px`,
            backgroundColor: isCorrectAnswer ? theme.palette.primary.correctColor : theme.palette.primary.lightGrey
          }}>
            <Typography variant="h5" sx={{ marginRight: `${theme.sizing.extraSmallPadding}px` }}>nknknkn</Typography>
            <Typography>nknknkn</Typography>
          </Box>

        </Box>
      </BodyCardContainerStyled>
    </BodyCardStyled>
  )
}
