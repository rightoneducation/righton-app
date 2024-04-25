import React from 'react';
import { Box, CircularProgress, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { GameSessionState, isNullOrUndefined } from '@righton/networking';
import LinearProgressBar from '../LinearProgressBar';

// import PlayerThinkingGraph from './PlayerThinkingGraph';

interface GraphClickInfo {
    graph: string | null;
    selectedIndex: any;
}

interface GptHint {
    themeText: string;
    teams: { name: string; rawHint: string }[];
    teamCount: number;
}
interface ProcessHintsFunction {
    (): void;
}

interface PlayerThinkingProps {
    hints: string[],
    gptHints: GptHint[],
    numPlayers: number;
    totalAnswers: number;
    statePosition: number;
    graphClickInfo: GraphClickInfo,
    isShortAnswerEnabled: boolean;
    handleGraphClick: (info: GraphClickInfo) => void;
    hintsError: boolean;
    currentState: GameSessionState;
    isHintLoading: boolean;
    handleProcessHints: ProcessHintsFunction;
}

const CenterContentStyled = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  borderRadius: '24px',
  padding: `16px`,
  backgroundColor: 'rgba(0,0,0,0)',
  gap: 16,
});

const TitleStyleStyled = styled(Typography)({
  color: 'var(--teacher-element-foreground, #FFF)',
  fontFamily: 'Poppins',
  fontSize: '24px',
  fontStyle: 'normal',
  fontWeight: '700',
  lineHeight: 'normal',
  textTransform: 'none',
  textAlign: 'left',
});

const InfoTextStyled = styled(Typography)({
  color: '#FFF',
  alignSelf: 'stretch',
  textAlign: 'left',
  fontFamily: 'Poppins',
  fontSize: '14px',
  fontStyle: 'normal',
  fontWeight: 400,
  lineHeight: 'normal',
});

const SubTextStyled = styled(Typography)({
  color: 'rgba(255, 255, 255, 0.6)',
  textAlign: 'center',
  fontFamily: 'Rubik',
  fontSize: '14px',
  fontWeight: '400',
});

const ButtonStyled = styled(Button)({
  border: '4px solid #159EFA',
  background: 'linear-gradient(#159EFA 100%,#19BCFB 100%)',
  borderRadius: '34px',
  width: '150px',
  height: '24px',
  color: 'white',
  fontSize: '15px',
  bottom: '0',
  fontWeight: '700',
  lineHeight: '30px',
  textTransform: 'none',
  '&:disabled': {
    background: `#909090`,
    color: '#FFF',
    boxShadow: 'none',
    border: '4px solid #909090',
    '&:hover': {
      background: `#909090`,
    },
  }
});

const PlayerThinking = ({
  hints,
  gptHints,
  numPlayers,
  totalAnswers,
  statePosition,
  graphClickInfo,
  isShortAnswerEnabled,
  handleGraphClick,
  hintsError,
  currentState,
  isHintLoading,
  handleProcessHints
}: PlayerThinkingProps) => {
    
  const isHintEmpty = isNullOrUndefined(gptHints) || gptHints?.length === 0;
  return (
    <CenterContentStyled>
      <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <TitleStyleStyled>
          Player Thinking
        </TitleStyleStyled>
      </Box>
      <InfoTextStyled>
        Players have optionally submitted hints to help other players.
      </InfoTextStyled>
      <Box style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 16 }}>
        {currentState === GameSessionState.CHOOSE_TRICKIEST_ANSWER ? (
          <>
            <InfoTextStyled>
              Players that have submitted a hint:
            </InfoTextStyled>
            <LinearProgressBar
              inputNum={hints ? hints.length : 0}
              totalNum={numPlayers}
            />
            <SubTextStyled>
              Hints will be displayed in the next phase
            </SubTextStyled>
          </>
        ) : (
          <>
            {!isHintEmpty && !isHintLoading && !hintsError ? (
              <>
                <Typography
                  //PLayerThinkingGraph.tsx goes here.
                />
                {graphClickInfo.graph === null && (
                  <SubTextStyled>
                    Tap on a response to see more details.
                  </SubTextStyled>
                )}
              </>
            ) : (
              <>
                {(isHintEmpty && !isHintLoading && !hintsError) && (
                  <>
                    <SubTextStyled>
                      No players submitted hints.
                    </SubTextStyled>
                  </>
                )}
                {(isHintLoading && !hintsError) && (
                  <>
                    <CircularProgress style={{ color: '#159EFA' }} />
                    <SubTextStyled>
                      The hints are loading ...
                    </SubTextStyled>
                  </>
                )}
                {hintsError && (
                  <>
                    <ButtonStyled
                      onClick={() => handleProcessHints()}
                    >
                      Retry
                    </ButtonStyled>
                    <SubTextStyled>
                      There was an error processing the hints. Please try again.
                    </SubTextStyled>
                  </>
                )}
              </>
            )}
          </>
        )}
      </Box>
    </CenterContentStyled>
  );
}

export default PlayerThinking;
