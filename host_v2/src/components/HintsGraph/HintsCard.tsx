import React, {useState, useEffect} from 'react';
import { CircularProgress, Box, Paper, Typography } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { GameSessionState, isNullOrUndefined, IHostTeamAnswersHint, ModelHelper } from '@righton/networking';
import HostDefaultCardStyled from '../../lib/styledcomponents/HostDefaultCardStyled';
import ButtonStyled from '../../lib/styledcomponents/ButtonStyled';
import HintsSubmittedBar from './HintsSubmittedBar';
import HintsGraph from './HintsGraph';
import { APIClientsContext } from '../../lib/context/ApiClientsContext';
import { useTSAPIClientsContext } from '../../hooks/context/useAPIClientsContext';
import { LocalGameSessionContext } from '../../lib/context/LocalGameSessionContext';
import { useTSGameSessionContext } from '../../hooks/context/useLocalGameSessionContext';


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
  numPlayers: number;
  graphClickInfo: any;
  handleGraphClick: any;
  hintsError: boolean;
  currentState: GameSessionState;
  isHintLoading: boolean;
}

export default function Hints({
  hints,
  numPlayers,
  graphClickInfo,
  handleGraphClick,
  hintsError,
  currentState,
  isHintLoading
}: HintsProps) {
  const [gptHints, setGPTHints] = useState<any>(null);
  const isHintEmpty = isNullOrUndefined(gptHints) || gptHints?.length === 0;
  const theme = useTheme();
  const [graphClickIndex, setGraphClickIndex] = useState<number | null>(null);
  const apiClients = useTSAPIClientsContext(APIClientsContext);
  const localGameSession = useTSGameSessionContext(LocalGameSessionContext);

  const handleProcessHints = (inputHints: IHostTeamAnswersHint[]) => {
    const currentQuestion = localGameSession.questions[localGameSession.currentQuestionIndex];
    const correctAnswer = ModelHelper.getCorrectAnswer(currentQuestion);
    let processedGPTHints;
    if (apiClients.hostDataManager)
      processedGPTHints = apiClients.hostDataManager.processGPTHints(inputHints, currentQuestion.text, correctAnswer?.text ?? '');
    setGPTHints(processedGPTHints);
  };
  console.log(hints);
  useEffect(() => {
    console.log(localGameSession.currentState);
    if (localGameSession.currentState === GameSessionState.PHASE_2_DISCUSS && hints) {
      handleProcessHints(hints);
    }
  }, [localGameSession.currentState]); // eslint-disable-line

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
                inputNum={hints ? hints.length : 0}
                totalNum={numPlayers}
            />
             <SubtitleStyled style={{fontStyle: 'italic'}}>
                Hints will be displayed in the next phase
            </SubtitleStyled>
          </>
        ) : (
          !isHintEmpty && !isHintLoading && !hintsError ? (
            graphClickInfo.graph === null && (
              <>
                <HintsGraph
                  data={gptHints}
                  setGraphClickIndex={setGraphClickIndex}
                />
                <Typography variant='h4' color={`${theme.palette.primary.main}`}>
                    Tap on a response to see more details.
                </Typography>
              </>
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
                  <CircularProgress style={{color:`${theme.palette.primary.circularProgress}`}}/>
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
