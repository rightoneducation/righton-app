import React from 'react';
import { LinearProgress, Box, Typography } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { IHostTeamAnswers, IHostTeamAnswersResponse, IGameSession, GameSessionState } from '@righton/networking';
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
  localGameSession: IGameSession;
  localHostTeamAnswers: IHostTeamAnswers;
  numPlayers: number;
  totalAnswers: number;
  questionChoices: string[];
  statePosition: number;
  graphClickInfo: IGraphClickInfo;
  isShortAnswerEnabled: boolean;
  handleGraphClick: ({ graph, selectedIndex }: IGraphClickInfo) => void;
}

export default function Responses({
  localGameSession,
  localHostTeamAnswers,
  numPlayers,
  totalAnswers,
  questionChoices,
  statePosition,
  graphClickInfo,
  isShortAnswerEnabled,
  handleGraphClick,
}: ResponsesProps) {
  const currentQuestion = localGameSession.questions[localGameSession.currentQuestionIndex];
  const currentPhase = localGameSession.currentState === GameSessionState.CHOOSE_CORRECT_ANSWER ? 'phase1' : 'phase2';
  const currentTeamAnswers = localHostTeamAnswers.questions.find((question) => question.questionId === currentQuestion.id)?.[currentPhase];
  const correctChoiceIndex = currentQuestion.choices.findIndex((choice) => choice.isAnswer);
  const [graphClickIndex, setGraphClickIndex] = React.useState<number | null>(null);
  return (
    <HostDefaultCardStyled>
      <ResponseContainer>
        <TitleStyled>
          Responses
        </TitleStyled>
        <ResponsesGraph
          data={currentTeamAnswers?.responses ?? []}
          numPlayers={numPlayers}
          totalAnswers={totalAnswers}
          questionChoices={questionChoices}
          statePosition={statePosition}
          graphClickInfo={graphClickInfo}
          isShortAnswerEnabled={isShortAnswerEnabled && statePosition < 6}
          handleGraphClick={handleGraphClick}
          setGraphClickIndex={setGraphClickIndex}
        />
        <SelectedAnswer 
          data={currentTeamAnswers?.responses ?? []}
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
