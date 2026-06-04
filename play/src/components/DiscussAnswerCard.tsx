import React from 'react';
import { useTheme, styled } from '@mui/material/styles';
import { Typography, Stack, Box, LinearProgress } from '@mui/material';
import { GameSessionState, IHostTeamAnswersResponse, BackendAnswer } from '@righton/networking';
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

const StyledHintBox = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  borderRadius: '8px',
  border: '2px #CCC solid',
  padding: '12px',
  marginTop: '12px'
})

interface DiscussAnswerCardProps {
  instructions: string[];
  answerStatus: AnswerState;
  answerReason?: string;
  currentState: GameSessionState;
  isShortAnswerEnabled: boolean;
  newPoints: number | undefined;
  selectedAnswer: BackendAnswer | null;
  teamAvatar: number;
  phaseOneResponse?: IHostTeamAnswersResponse;
  phaseTwoResponse?: IHostTeamAnswersResponse;
  otherAnswersCount?: number;
  totalAnswers?: number;
}

export default function DiscussAnswerCard({
  instructions,
  answerStatus,
  answerReason,
  currentState,
  isShortAnswerEnabled,
  newPoints,
  selectedAnswer,
  phaseOneResponse,
  phaseTwoResponse,
  otherAnswersCount,
  totalAnswers,
  teamAvatar
}: DiscussAnswerCardProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const hint = selectedAnswer?.hint;
  let rawHint = null
  if (hint)
    rawHint = JSON.parse(hint as unknown as string).rawHint;
  const resultText = (answerStatus === AnswerState.PLAYER_SELECTED_CORRECT)
    ? t('gameinprogress.discussanswer.correcttext')
    : t('gameinprogress.discussanswer.nicetrytext');
  const correctCard =
    answerStatus === AnswerState.CORRECT ||
    answerStatus === AnswerState.PLAYER_SELECTED_CORRECT;
  let percent = 0;
  if (answerStatus === AnswerState.OTHER)
    percent = otherAnswersCount! / totalAnswers! * 100;
  if (phaseOneResponse && totalAnswers) {
    percent = phaseOneResponse.count / totalAnswers * 100;
  }
  return (
    <BodyCardStyled elevation={10}>
      <BodyCardContainerStyled sx={{ alignItems: 'flex-start' }}>
      {correctCard && currentState === GameSessionState.PHASE_2_DISCUSS && (
        <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <Typography variant="h1" style={{color: theme.palette.designSystem.surface.play}}> Correct Answer </Typography>
        </Box>
      )}
      {!correctCard && currentState === GameSessionState.PHASE_2_DISCUSS && answerStatus !== AnswerState.OTHER && (
        <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <Typography variant="h1" style={{color: theme.palette.designSystem.surface.play}}>Incorrect Answer</Typography>
          {answerStatus === AnswerState.SELECTED &&(
            <NewPointsIndicator newPoints={newPoints} score={0} currentState={currentState}/>)}
        </Box>
      )}
        {currentState === GameSessionState.PHASE_1_DISCUSS && (
          <Box sx={{ marginBottom: '16px', width: '100%' }}>
            <Typography
              variant="largeParagraph"
              sx={{
                whiteSpace: 'pre-line',
                color: theme.palette.designSystem.surface.tertiary,
                display: 'inline-block',
                transformOrigin: 'left center',
                '@keyframes discussTextPopIn': {
                  '0%': { transform: 'scale(0.7)', opacity: 0 },
                  '60%': { transform: 'scale(1.08)', opacity: 1 },
                  '100%': { transform: 'scale(1)', opacity: 1 },
                },
                animation: 'discussTextPopIn 0.75s ease-out both',
              }}
            >
              { answerStatus === AnswerState.PLAYER_SELECTED_CORRECT 
               ? <b>{t('gameinprogress.discussanswer.correcttext')}</b>
               : <><b> {t('gameinprogress.discussanswer.nicetrytext1')} </b> {t('gameinprogress.discussanswer.nicetrytext2')}</>
              }
            </Typography>
          </Box>
        )}
        { answerStatus !== AnswerState.OTHER && (
        <ResultSelector
          answerStatus={answerStatus}
          letterCode={(currentState === GameSessionState.PHASE_1_DISCUSS ? phaseOneResponse?.multiChoiceCharacter : phaseTwoResponse?.multiChoiceCharacter) ?? ''}
          answerText={phaseOneResponse?.rawAnswer ?? ''}
          currentState={currentState}
          isShortAnswerEnabled={isShortAnswerEnabled}
          correctCard = {correctCard}
          newPoints={newPoints}
          teamAvatar={teamAvatar}
        />
        )}
         {(currentState === GameSessionState.PHASE_2_DISCUSS) &&
            <Box style={{width: '100%', display: 'flex', flexDirection: 'column', gap: '8px'}}>
              <Typography variant="body1" sx={{paddingTop: '16px'}}>
                {answerStatus !== AnswerState.OTHER ? 'Players who answered this way' : 'Players who answered something else'}
              </Typography>
                <BarContainer>
                  <StyledAnswerBar
                    variant="determinate"
                    sx={{
                      height: '18px',
                      borderRadius: '4px',
                      backgroundColor: theme.palette.primary.progressBarBackgroundColor,
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: answerStatus === AnswerState.SELECTED ? theme.palette.primary.progressBarSelectedColor : theme.palette.designSystem.surface.deepPurple
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
                    variant="h2"
                    sx={{
                      width: '30px',
                      textAlign: 'right',
                      color: theme.palette.designSystem.surface.pink
                    }}
                  >
                    {index + 1}
                  </Typography>
                </Box>
                <Typography
                  variant="body1"
                  sx={{ paddingLeft: `${theme.sizing.extraSmallPadding}px`,whiteSpace: 'pre-line' }}
                >
                  {instruction}
                </Typography>
              </Box>
            ))
          ) : (
            <Typography variant="body1" sx={{whiteSpace: 'pre-line'}}>{answerReason}</Typography>
          )}
        </Stack>
        { rawHint &&
          <StyledHintBox>
            <Typography variant="semiBoldParagraph" style={{color: `${theme.palette.designSystem.surface.tertiary}`}}>
              {t('gameinprogress.discussanswer.hinttext')}
            </Typography>
            <Typography variant="paragraph" style={{color: `${theme.palette.designSystem.surface.tertiary}`}}>
              {rawHint}
            </Typography>
          </StyledHintBox>
        }
      </BodyCardContainerStyled>
    </BodyCardStyled>
  );
}
