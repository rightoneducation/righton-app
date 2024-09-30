import React from 'react';
import { useTheme, styled } from '@mui/material/styles';
import { Typography, Stack, Box, LinearProgress } from '@mui/material';
import { GameSessionState, IHostTeamAnswersResponse } from '@righton/networking';
import { v4 as uuidv4 } from 'uuid';
import { useTranslation } from 'react-i18next';
import { AnswerState } from '../lib/PlayModels';
import BodyCardStyled from '../lib/styledcomponents/BodyCardStyled';
import BodyCardContainerStyled from '../lib/styledcomponents/BodyCardContainerStyled';
import InputNum from '../lib/styledcomponents/InputNum';
import ResultSelector from './ResultSelector';
import NewPointsIndicator from './NewPointsIndicator';


const BarContainer = styled(Box)({
  position: 'relative',
  width: '100%',
});

const StyledAnswerBar = styled(LinearProgress)({
  height: '18px',
  width: '100%',
  borderRadius: '3px',
  paddingLeft: '4px',
  paddingRight: '4px',
  boxSizing: 'border-box'
});

interface DiscussAnswerCardProps {
  instructions: string[];
  answerStatus: AnswerState;
  answerReason?: string;
  currentState: GameSessionState;
  isShortAnswerEnabled: boolean;
  newPoints: number | undefined;
  phaseOneResponse?: IHostTeamAnswersResponse;
  phaseTwoResponse?: IHostTeamAnswersResponse;
  totalAnswers?: number;
}

export default function DiscussAnswerCard({
  instructions,
  answerStatus,
  answerReason,
  currentState,
  isShortAnswerEnabled,
  newPoints,
  phaseOneResponse,
  phaseTwoResponse,
  totalAnswers
}: DiscussAnswerCardProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const resultText = (answerStatus === AnswerState.PLAYER_SELECTED_CORRECT)
    ? t('gameinprogress.discussanswer.correcttext')
    : t('gameinprogress.discussanswer.nicetrytext');
  const correctCard =
    answerStatus === AnswerState.CORRECT ||
    answerStatus === AnswerState.PLAYER_SELECTED_CORRECT;
  const AnswerTitleTypography = styled(Typography)({
    lineHeight: '28px',
    fontFamily: 'Karla',
    fontWeight: '800',
    fontSize: '24px',
    color: 'black',
  });
  let percent = 0;
  if (phaseOneResponse && totalAnswers) {
    percent = phaseOneResponse.count / totalAnswers * 100;
  }
  return (
    <BodyCardStyled elevation={10}>
      <BodyCardContainerStyled sx={{ alignItems: 'flex-start' }}>
      {correctCard && currentState === GameSessionState.PHASE_2_DISCUSS && (
        <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <AnswerTitleTypography> Correct Answer </AnswerTitleTypography>
        </Box>
      )}
      {!correctCard && currentState === GameSessionState.PHASE_2_DISCUSS && (
        <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <AnswerTitleTypography>Incorrect Answer</AnswerTitleTypography>
          {answerStatus === AnswerState.SELECTED &&(
            <NewPointsIndicator newPoints={newPoints} score={0} currentState={currentState}/>)}
        </Box>
      )}
        {correctCard && currentState === GameSessionState.PHASE_1_DISCUSS && (
          <Box sx={{ marginBottom: '16px', width: '100%' }}>
            <Box sx={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
              <Typography
                variant="subtitle1"
                sx={{ paddingBottom: `${theme.sizing.extraSmallPadding}px` }}
              >
                {resultText}
              </Typography>
              <NewPointsIndicator newPoints={newPoints} score={0} currentState={currentState}/>
            </Box>
            <Typography variant="body1">
              {t('gameinprogress.discussanswer.correctanswertext')}
            </Typography>
          </Box>
        )}
        <ResultSelector
          answerStatus={answerStatus}
          letterCode={(currentState === GameSessionState.PHASE_1_DISCUSS ? phaseOneResponse?.multiChoiceCharacter : phaseTwoResponse?.multiChoiceCharacter) ?? ''}
          answerText={phaseOneResponse?.rawAnswer ?? ''}
          currentState={currentState}
          isShortAnswerEnabled={isShortAnswerEnabled}
          correctCard = {correctCard}
          newPoints={newPoints}
        />
         {(currentState === GameSessionState.PHASE_2_DISCUSS) &&
            <Box style={{width: '100%', display: 'flex', flexDirection: 'column', gap: '8px'}}>
              <Typography sx={{paddingTop: '16px'}}>
                Players who answered this way
              </Typography>
                <BarContainer>
                  <StyledAnswerBar
                    variant="determinate"
                    sx={{
                      height: '18px',
                      borderRadius: '4px',
                      backgroundColor: theme.palette.primary.progressBarBackgroundColor,
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: answerStatus === AnswerState.SELECTED ? theme.palette.primary.progressBarSelectedColor : theme.palette.primary.darkPurple
                      }
                    }}
                    value={percent}
                  />
                  <InputNum progressPercent={percent}>{Math.floor(percent)}%</InputNum>
                </BarContainer>
            </Box>
            }
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
