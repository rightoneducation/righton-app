import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Typography, Stack, Box } from '@mui/material';
import { GameSessionState } from '@righton/networking';
import { v4 as uuidv4 } from 'uuid';
import { useTranslation } from 'react-i18next';
import { AnswerState } from '../lib/PlayModels';
import BodyCardStyled from '../lib/styledcomponents/BodyCardStyled';
import BodyCardContainerStyled from '../lib/styledcomponents/BodyCardContainerStyled';
import ResultSelector from './ResultSelector';

interface DiscussAnswerCardProps {
  isPlayerCorrect: boolean;
  instructions: string[];
  answerStatus: AnswerState;
  answerText: string;
  answerIndex: number;
  answerReason?: string;
  currentState: GameSessionState;
}

export default function DiscussAnswerCard({
  isPlayerCorrect,
  instructions,
  answerStatus,
  answerText,
  answerIndex,
  answerReason,
  currentState,
}: DiscussAnswerCardProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const resultText = isPlayerCorrect
    ? t('gameinprogress.discussanswer.correcttext')
    : t('gameinprogress.discussanswer.nicetrytext');
  const correctCard =
    answerStatus === AnswerState.CORRECT ||
    answerStatus === AnswerState.PLAYER_SELECTED_CORRECT;
  return (
    <BodyCardStyled elevation={10}>
      <BodyCardContainerStyled sx={{ alignItems: 'flex-start' }}>
        {correctCard && currentState === GameSessionState.PHASE_1_DISCUSS && (
          <Box sx={{ paddingBottom: `${theme.sizing.extraSmallPadding}px` }}>
            <Typography
              variant="subtitle1"
              sx={{ paddingBottom: `${theme.sizing.extraSmallPadding}px` }}
            >
              {resultText}
            </Typography>
            <Typography variant="body1">
              {t('gameinprogress.discussanswer.correctanswertext')}
            </Typography>
          </Box>
        )}
        <ResultSelector
          answerStatus={answerStatus}
          index={answerIndex}
          answerText={answerText}
        />
        <Stack
          spacing={1}
          sx={{ paddingTop: `${theme.sizing.extraSmallPadding}px` }}
        >
          {correctCard ? (
            instructions.map((instruction, index) => (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start',
                }}
                key={uuidv4()}
              >
                <Box sx={{ width: '30px' }}>
                  <Typography
                    variant="h3"
                    sx={{
                      width: '30px',
                      fontWeight: 700,
                      color: theme.palette.primary.darkPurple,
                      lineHeight: '20px',
                      textAlign: 'right',
                    }}
                  >
                    {index + 1}
                  </Typography>
                </Box>
                <Typography
                  variant="body1"
                  sx={{ paddingLeft: `${theme.sizing.extraSmallPadding}px` }}
                >
                  {instruction}
                </Typography>
              </Box>
            ))
          ) : (
            <Typography variant="body1">{answerReason}</Typography>
          )}
        </Stack>
      </BodyCardContainerStyled>
    </BodyCardStyled>
  );
}
