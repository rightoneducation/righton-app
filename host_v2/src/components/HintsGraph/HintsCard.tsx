import React, {useState, useEffect} from 'react';
import { CircularProgress, Box, Paper, Typography } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { GameSessionState, isNullOrUndefined, IHostTeamAnswersHint, ModelHelper, HostButton, HostButtonType } from '@righton/networking';
import { IGraphClickInfo } from '../../lib/HostModels';
import BodyCardContainerStyled from '../../lib/styledcomponents/BodyCardContainerStyled';
import HostDefaultCardStyled from '../../lib/styledcomponents/HostDefaultCardStyled';
import HintsSubmittedBar from './HintsSubmittedBar';
import HintsGraph from './HintsGraph';
import SelectedHints from './SelectedHints';
import { APIClientsContext } from '../../lib/context/ApiClientsContext';
import { useTSAPIClientsContext } from '../../hooks/context/useAPIClientsContext';
import { GameSessionContext } from '../../lib/context/GameSessionContext';
import { useTSGameSessionContext } from '../../hooks/context/useGameSessionContext';

const SubtitleStyled = styled(Typography)({
  color: '#FFFFFF',
  fontFamily: 'Rubik',
  fontSize: '12px',
  fontWeight: 400,
  width: '100%'
});

interface HintsProps {
  hints: any;
  numPlayers: number;
}

export default function Hints({
  hints,
  numPlayers,
}: HintsProps) {
  const [gptHints, setGPTHints] = useState<any>(null);
  const [graphClickIndex, setGraphClickIndex] = useState<number | null>(null);
  const [isHintLoading, setIsHintLoading] = useState<boolean>(false);
  const [isHintError, setIsHintError] = useState<boolean>(false);
  const [isHintEmpty, setIsHintEmpty] = useState<boolean>(true);
  const theme = useTheme();
  const { t } = useTranslation();
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
    <HostDefaultCardStyled style={{background: theme.palette.designSystem.gradients.background.host }} elevation={6}>
      <BodyCardContainerStyled style={{gap: `${theme.sizing.xSmPadding}px`}}>
        <Typography variant='h3' style={{color: theme.palette.primary.main}}>
          {t('hintscard.title')}
        </Typography>
        <Box style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', gap: 16, width: '100%' }}>
          { localGameSession.currentState === GameSessionState.CHOOSE_TRICKIEST_ANSWER ? ( // eslint-disable-line
            <>
              <Typography variant='label' style={{color: theme.palette.primary.main}}>
                {t('hintscard.submittedcount')}
              </Typography>
              <HintsSubmittedBar
                  inputNum={hints ? hints.length : 0}
                  totalNum={numPlayers}
              />
              <Typography variant='smallLabel' style={{color: theme.palette.primary.main, opacity: 0.5}}>
                {t('hintscard.minsubmissions')}
              </Typography>
            </>
          ) : (
            !isHintEmpty && !isHintLoading && !isHintError ? (
                <>
                  <Typography variant='label' style={{color: theme.palette.primary.main}}>
                    {t('hintscard.submitted')}
                  </Typography>
                  <HintsGraph
                    data={gptHints}
                    graphClickIndex={graphClickIndex}
                    handleGraphClick={handleGraphClick}
                  />
                  {graphClickIndex === null ? (
                    <Typography variant='smallLabel' style={{color: theme.palette.primary.main}}>
                      {t('hintscard.instructions')}
                    </Typography>
                  ) :
                    <SelectedHints hints={hints} gptHints={gptHints} graphClickIndex={graphClickIndex}/>
                  }
                </>
            ) : (
              <>
                {(isHintEmpty && !isHintLoading && !isHintError) && (
                  <Typography variant='label' style={{color: theme.palette.primary.main}}>
                    {t('hintscard.notenough')}
                  </Typography>
                )}
                {(isHintLoading && !isHintError) && (
                  <>
                    <Typography variant='label' style={{color: theme.palette.primary.main}}>
                      {t('hintscard.loading')}
                    </Typography>
                    <Box style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                      <CircularProgress style={{color: '#FFF'}}/>
                    </Box>
                    <Typography variant='smallLabel' style={{color: theme.palette.primary.main}}>
                      <b>{t('hintscard.organizing')}</b>
                    </Typography>
                    </>
                )}
                {isHintError && (
                    <>
                      <HostButton
                        buttonType={HostButtonType.CONTINUE}
                        label={t('hintscard.retry')}
                        isEnabled
                        onClick={() => handleProcessHints(hints)}
                      />
                      <Typography variant='h4' color={`${theme.palette.primary.main}`}>
                          {t('hintscard.error')}
                      </Typography>
                    </>
                )}
              </>
            )
          )}
        </Box>
      </BodyCardContainerStyled>
    </HostDefaultCardStyled>
  );
}
