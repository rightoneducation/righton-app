import React from 'react';
import { LinearProgress, Box, Typography } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { IQuestion, IHostTeamAnswers, IHostTeamAnswersResponse, IGameSession, GameSessionState } from '@righton/networking';
import { IGraphClickInfo } from '../lib/HostModels';
import HostDefaultCardStyled from '../lib/styledcomponents/HostDefaultCardStyled';
import ResponsesGraph from './ResponsesGraph/ResponsesGraph';
import SelectedAnswer from './ResponsesGraph/SelectedAnswer';

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
  currentResponses: IHostTeamAnswersResponse[];
  statePosition: number;
  graphClickInfo: IGraphClickInfo;
  isShortAnswerEnabled: boolean;
  handleGraphClick: ({ graph, selectedIndex }: IGraphClickInfo) => void;
}

export default function Responses({
  currentQuestion,
  currentResponses,
  statePosition,
  graphClickInfo,
  isShortAnswerEnabled,
  handleGraphClick,
}: ResponsesProps) {
  console.log(currentResponses);
  const correctChoiceIndex = currentQuestion.choices.findIndex((choice) => choice.isAnswer);
  const numPlayers = currentResponses.reduce((acc, response) => acc + response.count, 0) ?? 0;
  const [graphClickIndex, setGraphClickIndex] = React.useState<number | null>(null);
  return (
    <HostDefaultCardStyled>
      <ResponseContainer>
        <TitleStyled>
          Responses
        </TitleStyled>
        <ResponsesGraph
          data={currentResponses}
          statePosition={statePosition}
          graphClickInfo={graphClickInfo}
          isShortAnswerEnabled={isShortAnswerEnabled}
          handleGraphClick={handleGraphClick}
          setGraphClickIndex={setGraphClickIndex}
        />
        <SelectedAnswer 
          data={currentResponses}
          numPlayers={numPlayers}
          statePosition={statePosition}
          graphClickIndex={graphClickIndex}
          isShortAnswerEnabled={isShortAnswerEnabled && statePosition < 6}
          correctChoiceIndex={correctChoiceIndex}
        />
      </ResponseContainer>
    </HostDefaultCardStyled>
  );
}
