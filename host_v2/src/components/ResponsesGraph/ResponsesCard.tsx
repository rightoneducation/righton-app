import React from 'react';
import { LinearProgress, Box, Typography } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { IQuestion, IHostTeamAnswers, IHostTeamAnswersResponse, IGameSession, GameSessionState } from '@righton/networking';
import { IGraphClickInfo } from '../../lib/HostModels';
import HostDefaultCardStyled from '../../lib/styledcomponents/HostDefaultCardStyled';
import ResponsesGraph from './ResponsesGraph';
import SelectedAnswer from './SelectedAnswer';

const ResponseContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  width: '100%',
  maxWidth: '500px',
});

const TitleStyled = styled(Typography)({
  color: 'white',
  fontFamily: 'Poppins',
  fontSize: '24px',
  fontStyle: 'normal',
  fontWeight: '700',
  lineHeight: 'normal',
  textTransform: 'none',
  textAlign: 'left',
})

interface ResponsesProps {
  currentQuestion: IQuestion;
  responses: IHostTeamAnswersResponse[];
  statePosition: number;
  graphClickInfo: IGraphClickInfo;
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
  const correctChoiceIndex = currentQuestion.choices.findIndex((choice) => choice.isAnswer);
  const numPlayers = responses.reduce((acc, response) => acc + response.count, 0) ?? 0;
  const [graphClickIndex, setGraphClickIndex] = React.useState<number | null>(graphClickInfo.selectedIndex);
  // if game is short answer, we don't want to see all answers as they include m/c answers
  const trimmedResponses =
   (isShortAnswerEnabled || (statePosition > 6 && isPrevPhaseResponses)) 
    ? [...responses.filter((response) => response.multiChoiceCharacter !== '–' && response.count !== 0),...responses.filter((response) => response.multiChoiceCharacter === '–' && response.count !== 0)]
    : responses;
  return (
    <HostDefaultCardStyled>
      <ResponseContainer>
        <TitleStyled>
          { (statePosition < 6 || !isPrevPhaseResponses) ? `Responses` : `Phase 1 Responses` }
        </TitleStyled>
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
          correctChoiceIndex={correctChoiceIndex}
        />
      </ResponseContainer>
    </HostDefaultCardStyled>
  );
}
