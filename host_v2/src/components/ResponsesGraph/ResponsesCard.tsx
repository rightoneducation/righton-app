import React from 'react';
import { LinearProgress, Box, Typography } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { IQuestion, IHostTeamAnswers, IHostTeamAnswersResponse, IGameSession, GameSessionState } from '@righton/networking';
import { IGraphClickInfo, IGraphClickIndices } from '../../lib/HostModels';
import HostDefaultCardStyled from '../../lib/styledcomponents/HostDefaultCardStyled';
import ResponsesGraph from './ResponsesGraph';
import SelectedAnswer from './SelectedAnswer';

const ResponseContainer = styled(Box)(({theme}) => {
  return {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    width: '100%',
    maxWidth: '500px',
    gap: `${theme.sizing.smPadding}px`
  }
});

interface ResponsesProps {
  currentQuestion: IQuestion;
  responses: IHostTeamAnswersResponse[];
  statePosition: number;
  graphClickInfo: IGraphClickIndices;
  isShortAnswerEnabled: boolean;
  isPrevPhaseResponses: boolean;
  setGraphClickInfo: ({ graph, selectedIndex }: IGraphClickInfo) => void;
}

export default function Responses({
  currentQuestion,
  responses,
  statePosition,
  isShortAnswerEnabled,
  graphClickInfo,
  isPrevPhaseResponses,
  setGraphClickInfo
}: ResponsesProps) {
  const theme = useTheme();
  const numPlayers = responses.reduce((acc, response) => acc + response.count, 0) ?? 0;
  const responsesGraphName = statePosition < 6 || (statePosition > 6 && isPrevPhaseResponses) ? 'realtimephase1' : 'realtimephase2';
  const [graphClickIndex, setGraphClickIndex] = React.useState<number | null>(graphClickInfo[responsesGraphName] ?? null);
  // if game is short answer, we don't want to see all answers as they include m/c answers
  const trimmedResponses =
   (isShortAnswerEnabled || (statePosition > 6 && isPrevPhaseResponses)) 
    ? [...responses.filter((response) => response.multiChoiceCharacter !== '…' && response.count !== 0),...responses.filter((response) => response.multiChoiceCharacter === '…' && response.count !== 0)]
    : responses;
  return (
    <HostDefaultCardStyled style={{background: (statePosition >= 6 && !isPrevPhaseResponses) ? theme.palette.designSystem.gradients.background.host : theme.palette.primary.darkBlueCardColor }} elevation={6}>
      <ResponseContainer>
        <Typography variant='h3' style={{color: theme.palette.primary.main}}>
          { (statePosition >= 6 && !isPrevPhaseResponses) ? `Popular Incorrect Answer` : `Responses` }
        </Typography>
        <ResponsesGraph
          data={trimmedResponses}
          statePosition={statePosition}
          isShortAnswerEnabled={isShortAnswerEnabled}
          isPrevPhaseResponses={isPrevPhaseResponses}
          graphClickInfo={graphClickInfo}
          setGraphClickInfo={setGraphClickInfo}
          setGraphClickIndex={setGraphClickIndex}
        />
        <SelectedAnswer 
          isPrevPhaseResponses={isPrevPhaseResponses}
          data={trimmedResponses}
          numPlayers={numPlayers}
          statePosition={statePosition}
          graphClickInfo={graphClickInfo}
          isShortAnswerEnabled={isShortAnswerEnabled && statePosition < 6}
        />
      </ResponseContainer>
    </HostDefaultCardStyled>
  );
}
