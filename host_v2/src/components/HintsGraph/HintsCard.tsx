import React, {useState, useEffect} from 'react';
import { CircularProgress, Box, Paper, Typography } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { GameSessionState, isNullOrUndefined, IHostTeamAnswersHint, ModelHelper } from '@righton/networking';
import { IGraphClickInfo } from '../../lib/HostModels';
import HostDefaultCardStyled from '../../lib/styledcomponents/HostDefaultCardStyled';
import ButtonStyled from '../../lib/styledcomponents/ButtonStyled';
import HintsSubmittedBar from './HintsSubmittedBar';
import HintsGraph from './HintsGraph';
import SelectedHints from './SelectedHints';
import { APIClientsContext } from '../../lib/context/ApiClientsContext';
import { useTSAPIClientsContext } from '../../hooks/context/useAPIClientsContext';
import { GameSessionContext } from '../../lib/context/GameSessionContext';
import { useTSGameSessionContext } from '../../hooks/context/useGameSessionContext';


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
  currentState: GameSessionState;
}

export default function Hints({
  hints,
  numPlayers,
  currentState,
}: HintsProps) {
  const [gptHints, setGPTHints] = useState<any>(null);
  const [graphClickIndex, setGraphClickIndex] = useState<number | null>(null);
  const [isHintLoading, setIsHintLoading] = useState<boolean>(false);
  const [isHintError, setIsHintError] = useState<boolean>(false);
  const [isHintEmpty, setIsHintEmpty] = useState<boolean>(true);
  const theme = useTheme();
  const apiClients = useTSAPIClientsContext(APIClientsContext);
  const localGameSession = useTSGameSessionContext(GameSessionContext);

  const handleProcessHints = async (inputHints: IHostTeamAnswersHint[]) => {
    setIsHintLoading(true);
    const currentQuestion = localGameSession.questions[localGameSession.currentQuestionIndex];
    const correctAnswer = ModelHelper.getCorrectAnswer(currentQuestion);
    let processedGPTHints;
    if (apiClients.hostDataManager)
      processedGPTHints = await apiClients.hostDataManager.processGPTHints(inputHints, currentQuestion.text, correctAnswer?.text ?? '');
    if (processedGPTHints && processedGPTHints.gptHints && processedGPTHints.gptHints.themes){
      setIsHintLoading(false);
      setGPTHints(processedGPTHints.gptHints.themes);
      setIsHintEmpty(false);
    } else {
      setIsHintLoading(false);
      setIsHintError(true);
    }
  };

  const handleGraphClick = (selectedIndex: number) => {
    setGraphClickIndex(selectedIndex);
  }

  useEffect(() => {
    console.log(localGameSession.currentState);
    if (localGameSession.currentState === GameSessionState.PHASE_2_DISCUSS && hints && hints.length >= 3) {
      handleProcessHints(hints);
    }
  }, [localGameSession.currentState]); // eslint-disable-line
  return (
    <HostDefaultCardStyled elevation={10}>
      <BackgroundStyled elevation={0}>
        <TitleStyled> Player Thinking</TitleStyled>
        <SubtitleStyled>Players have optionally submitted hints to help other players.</SubtitleStyled>
      <Box style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 16, width: '100%' }}>
        { localGameSession.currentState === GameSessionState.CHOOSE_TRICKIEST_ANSWER ? ( // eslint-disable-line
          <>
            <SubtitleStyledLeftAlign>
                Players that have submitted a hint:
            </SubtitleStyledLeftAlign>
            <HintsSubmittedBar
                inputNum={hints ? hints.length : 0}
                totalNum={numPlayers}
            />
             <SubtitleStyled style={{fontStyle: 'italic'}}>
              { hints.length < 3
                ? `A minimum of 3 submissions are required to generate hints`
                : `Hints will be displayed in the next phase`
              }
            </SubtitleStyled>
          </>
        ) : (
          !isHintEmpty && !isHintLoading && !isHintError ? (
              <>
                <HintsGraph
                  data={gptHints}
                  graphClickIndex={graphClickIndex}
                  handleGraphClick={handleGraphClick}
                />
                {graphClickIndex === null ? (
                  <Typography variant='h4' color={`${theme.palette.primary.main}`}>
                    Tap on a response to see more details.
                  </Typography>
                ) :
                  <SelectedHints hints={hints} gptHints={gptHints} graphClickIndex={graphClickIndex}/>
                }
              </>
          ) : (
            <>
              {(isHintEmpty && !isHintLoading && !isHintError) && (
                <Typography variant='h4' color={`${theme.palette.primary.main}`} style={{ textAlign: 'center'}}>
                  Not enough players submitted hints.
                </Typography>
              )}
              {(isHintLoading && !isHintError) && (
                <>
                  <CircularProgress style={{color:`${theme.palette.primary.circularProgress}`}}/>
                  <Typography variant='h4' color={`${theme.palette.primary.main}`}>
                    The hints are loading ...
                  </Typography>
                  </>
              )}
              {isHintError && (
                  <>
                    <ButtonStyled
                      onClick={() => handleProcessHints(hints)}
                    >
                      Retry
                    </ButtonStyled>
                    <Typography variant='h4' color={`${theme.palette.primary.main}`}>
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
