import React, {useState} from 'react';
import { LinearProgress, Box, Paper, Typography } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { GameSessionState, isNullOrUndefined } from '@righton/networking';
// import LinearProgressBar from '../LinearProgressBar';
import HostDefaultCardStyled from '../../lib/styledcomponents/HostDefaultCardStyled';
import ButtonStyled from '../../lib/styledcomponents/ButtonStyled';
import HintsSubmittedBar from './HintsSubmittedBar';
import HintsGraph from './HintsGraph';

const BackgroundStyled = styled(Paper)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  borderRadius: '24px',
  padding: `16px`,
  backgroundColor: 'rgba(0,0,0,0)',
  gap: 16
});

const TitleStyled = styled(Typography)({
  color: '#FFFFFF',
  fontFamily: 'Poppins',
  textAlign: 'left',
  fontSize: '24px',
  fontWeight: 700,
  width: '100%',
});

const SubtitleStyled = styled(Typography)({
  color: '#FFFFFF',
  fontFamily: 'Rubik',
  textAlign: 'center',
  fontSize: '14px',
  fontWeight: 400,
  width: '100%'
});

const SubtitleStyledLeftAlign = styled(SubtitleStyled)({
  textAlign: 'left'
});

interface HintsProps {
  hints: any;
  gptHints: any;
  numPlayers: number;
  totalAnswers: number;
  questionChoices: any;
  statePosition: number;
  graphClickInfo: any;
  isShortAnswerEnabled: boolean;
  handleGraphClick: any;
  hintsError: boolean;
  currentState: GameSessionState;
  isHintLoading: boolean;
  handleProcessHints: any;
}

export default function Hints({
  hints,
  gptHints,
  numPlayers,
  totalAnswers,
  questionChoices,
  statePosition,
  graphClickInfo,
  isShortAnswerEnabled,
  handleGraphClick,
  hintsError,
  currentState,
  isHintLoading,
  handleProcessHints
}: HintsProps) {
  const isHintEmpty = isNullOrUndefined(gptHints) || gptHints?.length === 0;
  const theme = useTheme();
  return (
    <HostDefaultCardStyled elevation={10}>
      <BackgroundStyled elevation={0}>
        <TitleStyled> Player Thinking</TitleStyled>
        <SubtitleStyled>Players have optionally submitted hints to help other players.</SubtitleStyled>
      <Box style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 16, width: '100%' }}>
        { currentState === GameSessionState.CHOOSE_TRICKIEST_ANSWER ? ( // eslint-disable-line
          <>
            <SubtitleStyledLeftAlign>
                Players that have submitted a hint:
            </SubtitleStyledLeftAlign>
            <HintsSubmittedBar
                inputNum={5}
                totalNum={numPlayers}
            />
             <SubtitleStyled style={{fontStyle: 'italic'}}>
                Hints will be displayed in the next phase
            </SubtitleStyled>
          </>
        ) : (
          !isHintEmpty && !isHintLoading && !hintsError ? (
            graphClickInfo.graph === null && (
                <Typography variant='h4' color={`${theme.palette.primary.main}`}>
                    Tap on a response to see more details.
                </Typography>
            )
          ) : (
            <>
              {(isHintEmpty && !isHintLoading && !hintsError) && (
                <Typography variant='h4' color={`${theme.palette.primary.main}`}>
                  No players submitted hints.
                </Typography>
              )}
              {(isHintLoading && !hintsError) && (
                <>
                  {/* <CircularProgress style={{color:'#159EFA'}}/> */}
                  <Typography variant='h4' color={`${theme.palette.primary.main}`}>
                    The hints are loading ...
                  </Typography>
                  </>
              )}
              {hintsError && (
                  <>
                    <ButtonStyled
                      onClick={() => handleProcessHints(hints)}
                    >
                      Retry
                    </ButtonStyled>
                    <Typography variant='h4' color={`${theme.palette.primary}`}>
                        There was an error processing the hints. Please try again.
                    </Typography>
                  </>
              )}
            </>
          )
        )}
      </Box>
      </BackgroundStyled>
    </HostDefaultCardStyled>
  );
}
