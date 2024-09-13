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
  setGraphClickInfo: ({ graph, selectedIndex }: IGraphClickInfo) => void;
}

export default function Responses({
  currentQuestion,
  responses,
  statePosition,
  isShortAnswerEnabled,
  graphClickInfo,
  setGraphClickInfo
}: ResponsesProps) {
  const correctChoiceIndex = currentQuestion.choices.findIndex((choice) => choice.isAnswer);
  const numPlayers = responses.reduce((acc, response) => acc + response.count, 0) ?? 0;
  const [graphClickIndex, setGraphClickIndex] = React.useState<number | null>(graphClickInfo.selectedIndex);
  return (
    <HostDefaultCardStyled>
      <ResponseContainer>
        <TitleStyled>
          { statePosition < 6 ? `Responses` : `Phase 1 Responses` }
        </TitleStyled>
        <ResponsesGraph
          data={responses}
          statePosition={statePosition}
          isShortAnswerEnabled={isShortAnswerEnabled}
          graphClickInfo={graphClickInfo}
          setGraphClickInfo={setGraphClickInfo}
          setGraphClickIndex={setGraphClickIndex}
        />
        <SelectedAnswer 
          data={responses}
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
